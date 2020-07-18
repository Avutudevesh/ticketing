import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/validation-error';
import { DBConnectionError } from '../errors/db-connection-error';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('You must enter a valid email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 to 20 charecters')
],
  (req: Request, res: Response) => {
    const error = validationResult(req);
    console.log(error.array());
    if (!error.isEmpty()) {
      throw new RequestValidationError(error.array());
    }
    const { email, password } = req.body;
    throw new DBConnectionError();
  });

export { router as signupRouter };