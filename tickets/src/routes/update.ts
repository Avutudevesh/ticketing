import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError, requireAuth, validateRequest, BadRequestError, NotAuthorizedError } from '@daticketing/common';
import { body } from 'express-validator';

const router = express.Router();

router.put('/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title must be provided'),

    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero.')

  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new BadRequestError('ticket not found');
    }
    if (req.currentUser!.id !== ticket.userId) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price
    });

    ticket.save();
    res.send(ticket);
  });
export { router };