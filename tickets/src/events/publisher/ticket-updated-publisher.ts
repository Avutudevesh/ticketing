import { Publisher, TicketUpdatedEvent, Subjects } from '@daticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}