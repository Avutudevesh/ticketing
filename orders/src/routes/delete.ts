import express from 'express';
import { requireAuth, BadRequestError, NotAuthorizedError, OrderStatus } from '@daticketing/common';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId).populate('ticket');
  if (!order) {
    throw new BadRequestError('invalid orderId');
  }

  if (order?.userId != req.currentUser?.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  });

  res.send(order);
});

export { router };