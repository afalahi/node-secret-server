"use strict";

require("dotenv").config();
const uuid = require("uuid/v1");
const request = require("request-promise");
const fileSystem = require("fs");
const DataProtection = require("../lib/DataProtection");

const _clientAccount = new WeakMap();
const filePath = "creds.json";
const protect  = new DataProtection(filePath);

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
        .then((res) => {
          return res;
        })
        .then((res) => {
          let creds = {
            client_id: `sdk-client-${res.clientId}`,
            client_secret: res.clientSecret,
            grant_type: "client_credentials"
          };
          protect.encrypt(creds)
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
    });
  }

  static isInitialized() {
    if (!(fileSystem.existsSync(filePath))) {
      throw "Client not initialized";
    }
  }

  saveCredentials() {
    if (fileSystem.existsSync(filePath)) {
      console.log("Client Already Initialized");
      return;
    }
    _clientAccount.get(this)();
    console.log("Initialized");
  }

  loadCredentials() {
    if (!(fileSystem.existsSync(filePath))) {
      throw "Client not initialized";
    }

    let creds = protect.decrypt()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
    return creds;
  }

  destroyCredentials() {
    fileSystem.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      fileSystem.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Configuration remove successfully");
      });
    });
  }
}

module.exports = Configure;