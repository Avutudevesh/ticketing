import { PaymentCreatedEvent, Publisher, Subjects } from '@daticketing/common';
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}