import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@daticketing/common';

import { router as newTicketRouter } from './routes/new';
import { router as showTicketRouter } from './routes/show';
import { router as getTicketsRouter } from './routes';
import { router as updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(newTicketRouter);
app.use(showTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);


app.all('*', async () => {
  throw new NotFoundError();
})
app.use(errorHandler);

export { app };