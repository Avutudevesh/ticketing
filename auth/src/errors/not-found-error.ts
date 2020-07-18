import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor() {
    super('Route you are trying to access is not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialiseError() {
    return [{ message: 'Route you are trying to access is not found' }];
  }
}