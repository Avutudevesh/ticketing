import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../utils/password';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage('You must enter a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must be between 4 to 20 charecters')
],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid email or password');
    }
    if (!await Password.compare("existingUser", password)) {
      throw new BadRequestError('Inavlid email or password');
    }
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_ENV!);
    req.session = {
      jwt: userJwt
    }
    res.status(200).send(existingUser);

  });

export { router as signinRouter };