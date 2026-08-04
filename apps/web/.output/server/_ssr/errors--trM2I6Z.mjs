const ErrorCode = {
  VALIDATION: "VALIDATION",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN"
};
class AppError extends Error {
  code;
  statusCode;
  constructor(message, code, statusCode, options) {
    super(message, options);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class ValidationError extends AppError {
  fields;
  constructor(message, fields = {}, options) {
    super(message, ErrorCode.VALIDATION, 400, options);
    this.name = "ValidationError";
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class UnauthorizedError extends AppError {
  constructor(message = "Authentication required", options) {
    super(message, ErrorCode.UNAUTHORIZED, 401, options);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class ForbiddenError extends AppError {
  constructor(message = "Access denied", options) {
    super(message, ErrorCode.FORBIDDEN, 403, options);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export {
  ForbiddenError as F,
  UnauthorizedError as U,
  ValidationError as V
};
