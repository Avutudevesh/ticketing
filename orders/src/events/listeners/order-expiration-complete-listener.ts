import { Listener, OrderExpirationCompleteEvent, Subjects, OrderStatus } from '@daticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publisher/order-cancelled-publisher';

export class OrderExpirationCompleteListener extends Listener<OrderExpirationCompleteEvent> {
  readonly subject = Subjects.OrderExpirationCompleted;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('order not found to expire');
    }

    if (order.status === OrderStatus.COMPLETED) {
      return msg.ack();
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      }
    });
    msg.ack();
  }
}