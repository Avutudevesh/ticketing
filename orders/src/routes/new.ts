import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, BadRequestError, OrderStatus } from '@daticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 60;
router.post('/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .withMessage('Ticket id must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new BadRequestError('Ticket trying to book is not found');
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket already reserved');
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.CREATED,
      expiresAt: expiration,
      ticket
    });
    await order.save();
    console.log(`${order.id} order created`);
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });
    res.status(201).send(order);
  });

export { router };