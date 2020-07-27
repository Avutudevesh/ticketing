import express from 'express';
import { requireAuth, BadRequestError, NotAuthorizedError, OrderStatus } from '@daticketing/common';
import { Order } from '../models/order';

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

  res.send(order);
});

export { router };