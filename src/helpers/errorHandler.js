class SecretServerError extends Error {}

class ErrorHandler extends SecretServerError {
  constructor(message, response) {
    super(message);
    this.response = {
      statusCode: response.statusCode,
      body: response.body
    };
  }
}

module.exports = {
  SecretServerError,
  ErrorHandler
};