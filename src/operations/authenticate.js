require('dotenv').config();
const uuid = require('uuid/v1')
const request = require('request-promise');
const ruleName = process.env.RULE_NAME;
const ruleKey = process.env.RULE_KEY

const options = {
    method: 'POST',
    uri:'http://vault/api/v1/sdk-client-accounts',
    body:{
        clientID:uuid(),
        description:`Machine : ${require('os').hostname}, OS : ${process.platform} - NodeJS ${process.version} ${os.arch}`,
        name:hostname,
        ruleName:ruleName,
        onboardingKey:ruleKey
    },
    json:true
};
request(options)
    .then((res) =>{
        console.log(res.clientId)
        console.log(res.clientSecret)
    })
    .catch((err) =>{
        throw err
    });

class init{
    constructor(url, ruleName, ruleKey){
        this.url = url;
        this.ruleName = process.env.RULE_NAME || ruleName;
        this.ruleKey = process.env.RULE_KEY || ruleKey;
    }
    auth() {
        
    }
    
}
