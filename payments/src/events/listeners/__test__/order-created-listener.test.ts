import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@daticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 20
    },
    version: 0,
    expiresAt: 'wdafecea',
    status: OrderStatus.CREATED
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it('replicates order info', async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  const orders = await Order.find();

  expect(orders.length).toEqual(1);
  expect(orders[0].id).toEqual(data.id);

});

it('acks the message', async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});