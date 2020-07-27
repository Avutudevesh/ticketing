import { Publisher, TicketCreatedEvent, Subjects } from '@daticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}