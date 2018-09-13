require('dotenv').config();
const uuid = require('uuid/v1');
const request = require('request-promise');
function Authenticate (url, ruleName, ruleKey) {
    let baseURL = url || process.env.baseURL
    let options = {
        uri:`${baseURL}/api/v1/sdk-client-accounts`,
        body:{
            clientId:uuid(),
            description:`Machine : ${process.env.COMPUTERNAME}, OS : ${process.platform} ${process.arch} - NodeJS ${process.version}`,
            name:process.env.COMPUTERNAME || process.env.HOSTNAME,
            ruleName:ruleName || process.env.RULE_NAME,
            onboardingKey:ruleKey || process.env.RULE_KEY
        },
        json:true
    };
    console.log(options)
    return request.post(options) 
        .then(res => {
            return res
        })
        .then(res => {
            return request.post({
                uri:`${baseURL}/oauth2/token` || process.env.baseURL,
                form:{
                    client_id: `sdk-client-${res.clientId}`,
                    client_secret: res.clientSecret,
                    grant_type: 'client_credentials'
                }
            })
            .then(res => {
                return res;
            })
            .catch(err =>{
                throw err;
            })
        })
        .catch(err => {
            throw err;
        });
}
//Promise.resolve(Authenticate()).then(res =>{console.log(res)});

module.exports = Authenticate;