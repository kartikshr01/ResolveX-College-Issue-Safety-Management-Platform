const apiError = (statusCode, message) => {
  const error = new Error(message);
<<<<<<< HEAD
  error.statusCode = statusCode;
=======

  error.statusCode = statusCode;

  return error;
};

module.exports = apiError;