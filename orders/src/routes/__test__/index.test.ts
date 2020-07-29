import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@daticketing/common';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();
  return ticket;
}

it('returnes all tickets for particular user', async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  const order1 = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const responseUser1 = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .send()
    .expect(200)

  const responseUser2 = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send()
    .expect(200)

  expect(responseUser1.body.length).toEqual(1);
  expect(responseUser1.body[0].id).toEqual(order1.body.id);
  expect(responseUser2.body.length).toEqual(2);


});