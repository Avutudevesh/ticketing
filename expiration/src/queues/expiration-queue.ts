import Queue from 'bull';
import { OrderExpirationCompletePublisher } from '../events/order-expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('orders:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  },
});

expirationQueue.process(async (job) => {
  console.log(`${job.data.orderId} has expired`);
  new OrderExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };

