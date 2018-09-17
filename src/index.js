"use strict";

require('dotenv').config();
const Configure = require('./operations/Configure');
const request = require('request-promise');
const _config = new WeakMap()

class Client {
    constructor(options) {
        this.options = options || {};
        this.options.baseUrl = options ? options.url : process.env.baseURL;
        this.options.ruleName = options ? options.ruleName : process.env.RULE_NAME;
        this.options.ruleKey = options ? options.ruleKey : process.env.RULE_KEY;
        Object.keys(this.options).forEach((key) => {
            if(this.options[key] === undefined) {
                throw new TypeError(`${key} is undefined`)
            }
        });
        _config.set(this, () => { let config = new Configure(this.options); return config });
    }

    init() {
        _config.get(this)().saveCredentials();
    }

    accessToken() {
       let creds = _config.get(this)().loadCredentials();
       return request.post({
           uri:`${this.options.baseUrl}/oauth2/token`,
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