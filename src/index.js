"use strict";

require("dotenv").config();
const Configure = require("./operations/Configure");
const request = require("request-promise");
const Secret = require("./operations/Secret");

const _config = new WeakMap();
const _secret = new WeakMap();

class Client {
  constructor(options) {
    this.options = options || {};
    this.options.baseUrl = options ? options.url : process.env.baseURL;
    this.options.ruleName = options ? options.ruleName : process.env.RULE_NAME;
    this.options.ruleKey = options ? options.ruleKey : process.env.RULE_KEY;

    Object.keys(this.options).forEach((key) => {
      if (this.options[key] === undefined) {
        throw new TypeError(`${key} is undefined`);
      }
    });

    _config.set(this, () => { let config = new Configure(this.options); return config; });

    this.token = this.accessToken();
    let secret =  new Secret(this.options.baseUrl, this.token);
    _secret.set(this, secret);
  }

  init() {
    _config.get(this)().saveCredentials();
  }

  remove() {
    _config.get(this)().destroyCredentials();
  }

  accessToken() {
    return Promise.resolve(_config.get(this)().loadCredentials())
      .then(res => {
        return request.post({
          uri:`${this.options.baseUrl}/oauth2/token`,
          form: res
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  getSecret(id) {
    return Promise.resolve(_secret.get(this).get(id));
  }
  getSecretField(id, field) {
    return Promise.resolve(_secret.get(this).getField(id, field));
  }
}

module.exports = Client;