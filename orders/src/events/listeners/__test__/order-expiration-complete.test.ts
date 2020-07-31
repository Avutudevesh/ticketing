import { OrderExpirationCompleteListener } from '../order-expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { OrderStatus, OrderExpirationCompleteEvent } from '@daticketing/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: '5f23f0050824df06766bb9ca',
    price: 10,
    title: 'concert'
  });
  await ticket.save();
  const order = Order.build({
    userId: '5f23f0050824df06766bb9cd',
    ticket: ticket,
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
  });
  await order.save();

  const data: OrderExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, ticket, data, msg };

}

it('updates the order to cancelled', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
});

it('emit an order cancelled event', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});