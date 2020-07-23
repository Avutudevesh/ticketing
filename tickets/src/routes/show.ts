import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { BadRequestError } from '@daticketing/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new BadRequestError('ticket not found');
  }
  res.send(ticket);
});
export { router };