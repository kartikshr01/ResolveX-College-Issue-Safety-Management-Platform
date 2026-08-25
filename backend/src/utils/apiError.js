const apiError = (statusCode, message) => {
  const error = new Error(message);
<<<<<<< HEAD
  error.statusCode = statusCode;
=======

  error.statusCode = statusCode;

>>>>>>> fd93489e8be52556990ea1bcaaf9fe1ef906034f
  return error;
};

module.exports = apiError;