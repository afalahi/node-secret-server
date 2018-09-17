"use strict";
require('dotenv').config();
const Configure = require('./operations/Configure');
const request = require('request-promise');
const _config = new WeakMap()

class Client {
    constructor(url, ruleName, ruleKey) {
        this.baseUrl = url || process.env.baseURL;
        this.ruleName = ruleName || process.env.RULE_NAME;
        this.ruleKey = ruleKey || process.env.RULE_KEY
        _config.set(this, () => { let config = new Configure(this.baseUrl, this.ruleName, this.ruleKey); return config });
    }

    init() {
        _config.get(this)().saveCredentials();
    }

    accessToken() {
       let creds = _config.get(this)().loadCredentials();
       return request.post({
           uri:`${this.baseUrl}/oauth2/token`,
           form: creds
       })
       .then(res => {
           return res;
       })
       .catch(err => {
           throw err;
       })
    }
}
const cli = new Client


// function client(url, ruleName, ruleKey) {
//     return new Client(url, ruleName, ruleKey)
// }
//const cli = client().init()
module.exports = Client