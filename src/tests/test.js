const SecretServer = require('../index');

const client = new SecretServer
//client.init()
Promise.resolve(client.accessToken()).then(res => {console.log(res)})