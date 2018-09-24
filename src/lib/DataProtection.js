'use strict';

const fileSystem = require('fs');
const crypto = require('crypto');
const _masterKey = new WeakMap();
const _nonce = new WeakMap();
const _salt = new WeakMap();
const _key = new WeakMap();
const _encrypt = new WeakMap();

class DataProtection {
  constructor(filePath) {
    if (filePath === undefined) {
      throw new TypeError('Expected a string for file path')
    }

    this.filePath = filePath;

    //Generates a master key in base64 format. This master key will be used to derive the key for encryption. this key should be protected by an HSM or KMS
    _masterKey.set(this, () => {
      let masterKey
      try {
        if (!(fileSystem.existsSync('masterKey.config'))) {
          masterKey = crypto.randomBytes(32).toString('base64')

          fileSystem.writeFileSync('masterKey.config',masterKey)
        } else {
          masterKey = fileSystem.readFileSync('masterKey.config').toString()
        }

          return masterKey;
        } catch (e) {
          throw new Error(e.message);
        }
    });

    // the nonce for AES GCM
    _nonce.set(this, () => {
      return crypto.randomBytes(16);
    });

    //The salt used to derive the key
    _salt.set(this, () => {
      return crypto.randomBytes(64);
    });

    //The function that derives the key, this supports sync and async operations
    _key.set(this, (salt, callback) => {
        if(callback === undefined) {
            return crypto.pbkdf2Sync(_masterKey.get(this)(), salt, 2145, 32, 'sha512');
        }

        crypto.pbkdf2(_masterKey.get(this)(), salt, 2145, 32, 'sha512', (err, key) => {
            if (err) {
                return callback(err);
            }

            callback(null, key)
        });

    });

    //private method to encrypt and return encrypted data. cleaner code
    _encrypt.set(this, (key, nonce, data, salt) => {
      let cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
      let encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
      let tag = cipher.getAuthTag();
      let buffer = Buffer.concat([salt, nonce, tag, encrypted]);

      return buffer.toString('base64')
    });
  }

  encrypt(data) {
    return new Promise((resolve, reject) => {
      let nonce = _nonce.get(this)(),
        salt = _salt.get(this)();

      _key.get(this)(salt, (err, key) => {
        if (err) {
          reject(Error(err))
        }

        fileSystem.writeFile(this.filePath, _encrypt.get(this)(key,nonce, data, salt), err => {
          if (err){
            reject(Error(err));
          }

          resolve({message:"File Encrypted"})
        });
      });
    });
  }

  encryptSync(data) {
    try {
      let nonce = _nonce.get(this)(),
        salt = _salt.get(this)(),
        key = _key.get(this)(salt);

      fileSystem.writeFileSync(this.filePath, _encrypt.get(this)(key,nonce, data, salt));

      return {message: 'File encrypted'}

    } catch (e) {
        throw new Error(e.message)
    }
  }

  decrypt() {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.filePath, (err, data) => {
        if(err){
          reject(Error(err));
        }
        let buffer = Buffer.from(data.toString(), 'base64'),
          salt = buffer.slice(0,64),
          nonce = buffer.slice(64, 80),
          tag = buffer.slice(80, 96),
          content = buffer.slice(96)

        _key.get(this)(salt, (err, key) => {
          if(err){
            reject(Error(err))
          }

          let decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce );
          decipher.setAuthTag(tag);

          resolve(JSON.parse(decipher.update(content, 'binary', "utf8")+decipher.final('utf8')));
        });
      });
    });
  }

  decryptSync() {
    try {
      let data = Buffer.from(fileSystem.readFileSync(this.filePath).toString(), 'base64'),
        salt = data.slice(0,64),
        nonce = data.slice(64,80),
        tag = data.slice(80,96),
        content = data.slice(96),
        key = _key.get(this)(salt);

      let decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce );
      decipher.setAuthTag(tag);

      return JSON.parse(decipher.update(content, 'binary', "utf8")+decipher.final('utf8'));
    } catch (e) {
        throw e.message
    }
  }
}
 module.exports = DataProtection