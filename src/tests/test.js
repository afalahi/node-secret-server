const SecretServer = require('../index');
const fileSystem = require('fs');
const crypto = require('crypto');
//const DataProtection = require('../lib/DataProtection');
//const protect = new DataProtection()


const client = new SecretServer()
//client.init()
//Promise.resolve(client.accessToken()).then(res => {console.log(res)})
client.remove()

// let masterKey
// try{
//     if(!(fileSystem.existsSync('masterKey.json'))){
//         masterKey = crypto.randomBytes(32).toString('base64')
//         fileSystem.writeFileSync('masterKey.json',JSON.stringify({key:masterKey}));
//     } else {
//         masterKey = JSON.parse(fileSystem.readFileSync('masterKey.json')).key
//         console.log(masterKey)
//     }
//     let salt = crypto.randomBytes(64);
//     let key = crypto.pbkdf2Sync(masterKey, salt, 2145, 32, 'sha512');
//     console.log(key.toString('base64'));
//     return key;
// } catch (e) {
//     throw new Error(e.message);
// }
// function getKey(salt, callback){
//     if(callback === undefined){
//         return crypto.pbkdf2Sync("thisisapassword", salt, 2145, 32, 'sha512');
//     }
//     crypto.pbkdf2("thisisapassword", salt, 2145, 32, 'sha512', (err, derivedKey) =>{
//         if (err){
//             return callback(err);
//         }
//         callback(null, derivedKey)
//     });
// }
// let key = getKey('thisissalt', function(err, buffer){
//     if(err) {
//         throw err;
//     }
//     return buffer
// })

// console.log(key);