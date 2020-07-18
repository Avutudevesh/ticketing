import { CustomError } from './custom-error';

export class DBConnectionError extends CustomError {
  statusCode = 500
  constructor(public reason = 'Error connecting to DB') {
    super(reason);
    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  serialiseError() {
    return [{ message: this.reason }];
  }
}