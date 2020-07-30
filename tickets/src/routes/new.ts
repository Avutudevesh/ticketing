import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@daticketing/common'
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
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
    const { title, price } = req.body;
    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });
    await newTicket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
      version: newTicket.version
    });
    res.status(201).send(newTicket);
  });

export { router };

