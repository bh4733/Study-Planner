export const asyncHandler = (handler) => (req, res, next) =>
  promise.resolve(handler(req, res, next)).catch(next);
