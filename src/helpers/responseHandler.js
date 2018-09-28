const ErrorHandler = require("./ErrorHandler");
const ApiError = ErrorHandler.ErrorHandler;
const SecretServerError = ErrorHandler.SecretServerError;

class ResponseHandler {
  constructor(response) {
    if (!response) {
      return Promise.reject(new SecretServerError("No response passed"));
    }

    if (response.statusCode !== 200 && response.statusCode !== 204) {
      let message;

      if (response.body && response.body.errorCode && response.body.errorCode.length > 0) {
        message = response.body.errorCode;
      } else {
        message = `Status ${response.statusCode}`;
      }

      const error = new ApiError(message, response);
      return Promise.reject(error);
    }
    return Promise.resolve(response.body);
  }
}

module.exports = ResponseHandler;