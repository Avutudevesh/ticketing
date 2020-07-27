import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler to handle new ticket creation', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('should be signed in to create new ticket', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
});

it('should not throw unauthorized error when signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});



it('returns error when no valid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);

});

it('returns error when no valid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title'
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: -10
    })
    .expect(400);

});

it('should save ticket in db when ticket creating successful', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 10
    })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual('title')
  expect(tickets[0].price).toEqual(10);

});

it('nats publish gets called', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 10
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});