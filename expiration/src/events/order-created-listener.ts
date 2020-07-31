import { Listener, Subjects, OrderCreatedEvent } from '@daticketing/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  readonly subject = Subjects.OrderCreated;

  queueGroupName = "expiration-service"

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log(data.expiresAt);
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting for ${delay} milliseconds`);
    await expirationQueue.add({
      orderId: data.id
    }, {
      delay
    });
    msg.ack();
  }
}