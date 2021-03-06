import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
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
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.body.id).toEqual(order.body.id);
});