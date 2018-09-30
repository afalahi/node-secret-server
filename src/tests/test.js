const SecretServer = require('../index');
const fileSystem = require('fs');
const crypto = require('crypto');
const homeDir = require('os').homedir();
//const DataProtection = require('../lib/DataProtection');
//const protect = new DataProtection()

const client = new SecretServer()
// client.init()
// client.getSecret(5).then(res => {console.log(res.items.find(i => i.fieldName == "Password").itemValue)}).catch(err => console.log(err));
//  client.getSecret(8).then
client.getSecretField(8, 'password').then((res) => {console.log(res)}).catch((err) => console.error(err));
//client.remove()
//Promise.resolve(client.accessToken()).then(res => {console.log(JSON.parse(res).access_token)})
// fileSystem.writeFile(`${homeDir}/creds.json`,'utf8', (err) =>{
//     if (err) throw err;
// })