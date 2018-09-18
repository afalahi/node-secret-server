const SecretServer = require('../index');
const fileSystem = require('fs');
const crypto = require('crypto');
/*
const client = new SecretServer()
//client.init()
Promise.resolve(client.accessToken()).then(res => {console.log(res)})
*/
try{
    if(!(fileSystem.existsSync('key.txt'))){
        fileSystem.writeFileSync('key.txt',crypto.randomBytes(32).toString('hex'));
    }
} catch (e) {
    throw new Error(e.message);
}

console.log(crypto.randomBytes(12).toString('hex'));