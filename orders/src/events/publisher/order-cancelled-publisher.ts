import { Publisher, OrderCancelledEvent, Subjects } from '@daticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
} 