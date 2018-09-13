"use strict";

require('dotenv').config();
const uuid = require('uuid/v1');
const request = require('request-promise');
const fs = require('fs');
const _getCreds 

class Configure {
    constructor (url, ruleName, ruleKey){
        this.baseUrl = url || process.env.baseURL;
        this.ruleName = ruleName || process.env.RULE_NAME;
        this.ruleKey = ruleKey || process.env.RULE_KEY
    }
    getCreds() {
        let options = {
            uri:`${this.baseUrl}/api/v1/sdk-client-accounts`,
            body:{
                clientId: uuid(),
                description: `Machine : ${process.env.COMPUTERNAME}, OS : ${process.platform} ${process.arch} - NodeJS ${process.version}`,
                name: process.env.COMPUTERNAME || process.env.HOSTNAME,
                ruleName: this.ruleName,
                onboardingKey: this.ruleKey
            },
            json:true
        };
        return request.post(options) 
            .then(res => {
                return res;
            })
            .catch(err =>{
                throw err;
            })
    }
    setCreds(){
        Promise.resolve(this.getCreds()).then(res => {
            let creds = {
                client_id: `sdk-client-${res.clientid}`,
                client_secret: res.clientSecret,
                grant_type: 'client_credentials'
            }
            fs.writeFile('.\creds.json',JSON.stringify(creds), function(err, file){
                if (err) throw err;
            })
        })
    }
}
const config = new Configure()
config.setCreds()
