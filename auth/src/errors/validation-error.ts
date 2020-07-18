import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {

  constructor(public errors: ValidationError[]) {
    super('Validation error');
    this.errors = errors;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  statusCode = 400;

  serialiseError() {
    return this.errors.map((err) => {
      return {
        message: err.msg,
        field: err.param
      }
    })
  }

}