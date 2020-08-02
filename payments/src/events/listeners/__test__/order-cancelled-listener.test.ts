import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@daticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: 'abc',
    version: 0,
    price: 20,
    status: OrderStatus.CREATED
  });
  await order.save();
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString()
    },
    version: order.version + 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg, order };
};

it('changes order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);


});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});