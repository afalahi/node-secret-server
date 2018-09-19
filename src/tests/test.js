const SecretServer = require('../index');
const fileSystem = require('fs');
const crypto = require('crypto');
/*
const client = new SecretServer()
//client.init()
Promise.resolve(client.accessToken()).then(res => {console.log(res)})
*/
try{
    if(!(fileSystem.existsSync('aes-key.json'))){
        fileSystem.writeFileSync('aes-key.json',JSON.stringify({key:crypto.randomBytes(32).toString('hex')}));
        return fileSystem.readFileSync('aes-key.json')
    }
} catch (e) {
    throw new Error(e.message);
}

console.log(crypto.randomBytes(12).toString('hex'));