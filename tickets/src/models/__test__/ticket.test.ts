import { Ticket } from '../ticket';

it('implemens optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123'
  });

  await ticket.save();

  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  ticket1!.set({ price: 20 });
  ticket2!.set({ price: 30 });

  await ticket1!.save();

  try {
    await ticket2!.save();
  } catch (e) {
    return done();
  }

  throw new Error('Shouldnot reach here');

});

it('increments ticket number on every save', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});