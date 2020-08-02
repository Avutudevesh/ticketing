import { Listener, OrderCancelledEvent, Subjects, OrderStatus } from '@daticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id, version } = data;
    const order = await Order.findOne({ _id: id, version: version - 1 });
    if (!order) {
      throw new Error('order not found');
    }
    order.status = OrderStatus.CANCELLED;
    await order.save();
    msg.ack();
  }
}