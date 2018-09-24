const SecretServer = require('../index');
const fileSystem = require('fs');
const crypto = require('crypto');
//const DataProtection = require('../lib/DataProtection');
//const protect = new DataProtection()

const client = new SecretServer()
//client.init()
Promise.resolve(client.readSecret({uri:'api/v1/secrets/5'})).then(res => {console.log(res)})
//client.remove()
//Promise.resolve(client.accessToken()).then(res => {console.log(JSON.parse(res).access_token)})