'use strict';

const fileSystem = require('fs');
const crypto = require('crypto');
const _filePath = new WeakMap();
const _key = new WeakMap();
const _nonce = new WeakMap();

class DataProtection {

    constructor(filePath) {
        _filePath.set(this, filePath);
        _key.set(this, () =>{
            try{
                if(!(fileSystem.existsSync('key.txt'))){
                    fileSystem.writeFileSync('key.txt',crypto.randomBytes(32).toString('hex'));
                }
            } catch (e) {
                throw new Error(e.message);
            }
        });
        _nonce.set(this, () => {
            crypto.randomBytes(12).toString('hex');
        });
    }

    encryptAsync(data) {
        
    }

    encrypt(data) {
        try {
            let cipher = crypto.createCipheriv('aes-256-gcm', _key.get(this)(), _nonce.get(this)())
            let encrypted = Buffer.concat([cipher.update(new Buffer(JSON.stringify(data), "utf8")), cipher.final()])
            fileSystem.writeFileSync(_filePath.get(this), encrypted)
            return {message: 'File encrypted'}
        } catch (exception) {
            throw new Error(exception.message)
        }
    }

    decryptAsync() {

    }

    decrypt() {
        try {
            let data = fileSystem.readFileSync(_filePath.get(this));
            let decipher = crypto.createDecipheriv('aes-256-gcm', _key.get(this)() );
        } catch (exception) {
            
        }
    }
}