const request = require('request-promise');

class Secret {
  constructor(url) {
    if (url === undefined) {
      throw TypeError('Url not defined')
    }
    this.request = request.defaults({
      baseUrl: url,
      json:true,
      resolveWithFullResponse:true,
      simple:false
    });
  }

  get(options, token) {
    if (options === undefined) {
      throw TypeError('Expected an object')
    }

    return Promise.resolve(token)
      .then(res => {
        options.headers = {Authorization: `bearer ${JSON.parse(res).access_token}`}
        return options
      })
      .then(res => {
        return this.request.get(res)
          .then(res => {
            return res;
          })
          .catch(err => {
            throw err;
          });
      })
      .catch( err => {
        throw err;
      });
  }
}

module.exports = Secret