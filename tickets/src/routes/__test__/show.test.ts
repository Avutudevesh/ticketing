import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return 400 if no ticket is found', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(400);
});

it('returnes ticket successfully', async () => {
  const title = 'concert';
  const price = 20;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    });
  await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

})