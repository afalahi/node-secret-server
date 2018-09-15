"use strict";
require('dotenv').config();
const config = require('./operations/configure');
const request = require('request-promise');

class Client {
    constructor(url, ruleName, ruleKey) {
        this.url = url,
        this.ruleName = ruleName,
        this.ruleKey = ruleKey
    }
    init(){
        config(this.url, this.ruleName, this.ruleKey)
    }
}

function client(url, ruleName, ruleKey) {
    return new Client(url, ruleName, ruleKey)
}

const cli = client()
cli.init()
module.exports = client