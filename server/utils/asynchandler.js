// Express 4 doesn't catch errors thrown inside async route handlers.
// This wrapper passes them to the error handler in app.js instead of leaving the request hanging.
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
