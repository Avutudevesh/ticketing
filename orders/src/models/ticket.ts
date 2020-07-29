import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order } from './order';
import { OrderStatus } from '@daticketing/common';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(data: { id: string, version: number }): Promise<TicketDoc | null>
}

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id,
        delete ret._id
    }
  }
});

schema.set('versionKey', 'version');
schema.plugin(updateIfCurrentPlugin);

schema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}
schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
}

schema.methods.isReserved = async function () {
  const exiastingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.CREATED,
        OrderStatus.COMPLETED,
        OrderStatus.AWAITING_PAYMENT
      ]
    }
  });

  return !!exiastingOrder;

}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', schema);

export { Ticket, TicketDoc };