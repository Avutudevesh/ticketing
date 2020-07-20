import request from 'supertest';
import { app } from '../../app';

it('returnes current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('returnes null current user when not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});