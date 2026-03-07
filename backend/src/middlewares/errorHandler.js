function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "SERVER_ERROR";
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", {
      code,
      statusCode,
      message,
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}

module.exports = errorHandler;
