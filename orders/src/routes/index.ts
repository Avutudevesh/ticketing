import express from 'express';
import { Order } from '../models/order';
import { requireAuth } from '@daticketing/common';


const router = express.Router();

router.get('/api/orders', requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.currentUser?.id }).populate('ticket');
  res.send(orders);
});

export { router };