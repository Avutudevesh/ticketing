import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 404;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialiseError() {
    return [{
      message: this.message
    }]
  }
}