export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  // Always log the full error server-side (for debugging / log aggregation)
  console.error(err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;
  const isProd     = process.env.NODE_ENV === 'production';

  // In production: never send internal error details to the client.
  // Mongoose CastError, Mongoose ValidationError, and unknown errors all
  // get a generic message — only purpose-built errors (with .statusCode set)
  // have their message forwarded.
  const clientMessage = isProd && statusCode === 500
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success:  false,
    message:  clientMessage,
    // Stack only in development — never expose to production clients
    ...(isProd ? {} : { stack: err.stack }),
  });
};
