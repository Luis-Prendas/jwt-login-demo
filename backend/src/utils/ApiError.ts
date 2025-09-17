export class ApiError extends Error {
  statusCode: number;
  details?: object;

  constructor(statusCode: number, message: string, details?: object) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}