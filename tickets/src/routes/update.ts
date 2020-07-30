import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { requireAuth, validateRequest, BadRequestError, NotAuthorizedError } from '@daticketing/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';

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
    if (ticket.orderId) {
      throw new BadRequestError('ticket is reserved');
    }
    if (req.currentUser!.id !== ticket.userId) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price
    });

    ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    });
    res.send(ticket);
  });
export { router };