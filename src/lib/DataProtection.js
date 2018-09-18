const fileSystem = require('fs');
const crypto = require('crypto');
const _filePath = new WeakMap();
const _password = new WeakMap();
const _iv = new WeakMap();

class DataProtection {
    constructor(filePath, password) {
        _filePath.set(this, filePath);
        _password.set(this, password);
        _iv.set(this, () =>{
            crypto.randomBytes(20).toString('hex');
        })
    }

    encryptAsync(data){}

    encrypt(data) {
        try {
            let cipher = crypto.createCipheriv('aes-256-gcm',_password.get(this),_iv.get(this)())
            let encrypted = Buffer.concat([cipher.update(new Buffer(JSON.stringify(data), "utf8")), cipher.final()])
        } catch (exception) {
            
        }
    }

    decryptAsync() {}

    decrypt(){}
}