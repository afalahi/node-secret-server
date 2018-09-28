const request = require('request-promise');
const ResponseHandler = require('../helpers/ResponseHandler');

class Secret {
  constructor(url, token) {
    if (url === typeof undefined) {
      throw TypeError('Url not defined')
    }
    this.rp = request.defaults({
      baseUrl: `${url}/api/v1/secrets/`,
      json:true,
      resolveWithFullResponse:true,
      simple:false
    });
    this.token = token;
    this.ResponseHandler = ResponseHandler;
    this.request = (options = {}) => {
      return this.rp(options).then(res => new ResponseHandler(res));
    }
  }

  get (id) {
    if (id === typeof undefined) {
      throw 'Expected a secret ID';
    }
  
    return this.token
      .then((res) => {
        let options = {};
        options.headers = {Authorization: `bearer ${JSON.parse(res).access_token}`};
        options.uri = id.toString();
        options.method = 'GET';
        return options;
      })
      .then((res) => {
        return this.request(res);
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = Secret;