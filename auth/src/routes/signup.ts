import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
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
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }
    const user = User.build({ email, password });
    await user.save();
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);
    req.session = {
      jwt: userJwt
    }
    res.status(201).send(user);
  });

export { router as signupRouter };