"use strict";

require('dotenv').config();
const uuid = require('uuid/v1');
const request = require('request-promise');
const fileSystem = require('fs');
const _clientAccount = new WeakMap();

class Configure {
    
    constructor (options) {
        _clientAccount.set(this, () => {
            let opts = {
                uri:`${options.baseUrl}/api/v1/sdk-client-accounts`,
                body:{
                    clientId: uuid(),
                    description: `Machine : ${process.env.COMPUTERNAME || process.env.HOSTNAME}, OS : ${process.platform} ${process.arch} - NodeJS ${process.version}`,
                    name: process.env.COMPUTERNAME || process.env.HOSTNAME,
                    ruleName: options.ruleName,
                    onboardingKey: options.ruleKey
                },
                json:true
            };
            return request.post(opts) 
                .then(res => {
                    return res;
                })
                .then(res => {
                    let creds = {
                        client_id: `sdk-client-${res.clientId}`,
                        client_secret: res.clientSecret,
                        grant_type: 'client_credentials'
                    }
                    fileSystem.writeFile(`creds.json`,JSON.stringify(creds), function(err, file) {
                        if (err) throw err;
                    });
                })
                .catch(err => {
                    throw err;
                });
        });
    }

    saveCredentials() {
        if(fileSystem.existsSync("creds.json")) {
            throw "Client Already Initialized"
        }
        _clientAccount.get(this)();
    }

    loadCredentials() {
        if(!(fileSystem.existsSync('creds.json'))) {
            throw "Client not initialized"
        }
        let creds = JSON.parse(fileSystem.readFileSync('creds.json',"utf8"));
        return creds
    }
}

module.exports = Configure;