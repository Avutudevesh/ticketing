import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '@daticketing/common';

it('cancels the order', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const fetchedOrder = await request(app)
    .delete(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.body.id).toEqual(order.body.id);
  expect(fetchedOrder.body.status).toEqual(OrderStatus.CANCELLED);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});