require('dotenv').config();
const uuid = require('uuid/v1')
const os = require('os');
const request = require('request-promise');
const ruleName = process.env.RULE_NAME;
const ruleKey = process.env.RULE_KEY
const hostname = os.hostname()

const options = {
    method: 'POST',
    uri:'http://vault/api/v1/sdk-client-accounts',
    body:{
        clientID:uuid(),
        description:`Machine : ${hostname}, OS : ${os.platform} - NodeJS ${process.version} ${os.arch}`,
        name:hostname,
        ruleName:ruleName,
        onboardingKey:ruleKey
    },
    json:true
};
console.log(ruleName)
request(options)
    .then((res) =>{
        console.log(res.clientId)
        console.log(res.clientSecret)
    })
    .catch((err) =>{
        throw err
    });
    

