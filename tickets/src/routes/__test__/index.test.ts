import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTicket = async () => {
  const title = 'concert';
  const price = 20;
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);
}

it('can get list of tickets', async () => {
  createTicket();
  createTicket();
  createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
})