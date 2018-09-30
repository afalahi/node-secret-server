"use strict";

const request = require("request-promise");
const ResponseHandler = require("../helpers/ResponseHandler");

class Secret {
  constructor(url, token) {
    if (url === undefined) {
      throw new TypeError("url not defined");
    }
    //set request defaults
    this.rp = request.defaults({
      baseUrl: `${url}/api/v1/secrets/`,
      json:true,
      resolveWithFullResponse:true,
      simple:false
    });
    this.options = {};
    //handle the responses
    this.request = (options = {}) => {
      return token
        .then((res) => {
          options.headers = {Authorization: `bearer ${JSON.parse(res).access_token}`};
        })
        .then((res) => {
          return this.rp(options).then((res) => new ResponseHandler(res));
        })
        .catch((err) => {
          throw err;
        });
    };
  }

  get(id) {
    if (id === undefined) {
      throw "Expected a secret ID";
    }
    this.options.uri = id.toString();
    this.options.method = "GET";

    return this.request(this.options);
  }

  getField(id, field) {
    if (id === undefined && field === undefined) {
      throw "Both Secret Id and fields are required"
    }
    this.options.uri = `${id.toString()}/fields/${field}`;
    this.options.method = "GET";

    return this.request(this.options);
  }
}

module.exports = Secret;