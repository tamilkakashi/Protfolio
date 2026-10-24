function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  let status = error.statusCode || 500;
  let message = status >= 500 ? "An unexpected server error occurred." : error.message;

  if (error.name === "CastError") {
    status = 400;
    message = "Invalid identifier or value.";
  } else if (error.name === "ValidationError") {
    status = 400;
    message = "Invalid data supplied.";
  }

  if (status >= 500) console.error(error);
  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
