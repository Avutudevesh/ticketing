import { Publisher, OrderCreatedEvent, Subjects } from '@daticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
} 