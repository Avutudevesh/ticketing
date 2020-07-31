import { Publisher, OrderExpirationCompleteEvent, Subjects } from '@daticketing/common';

export class OrderExpirationCompletePublisher extends Publisher<OrderExpirationCompleteEvent> {
  readonly subject = Subjects.OrderExpirationCompleted;
}