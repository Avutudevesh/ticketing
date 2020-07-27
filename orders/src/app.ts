import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@daticketing/common';
import { router as indexRouter } from './routes/index';
import { router as deleteRouter } from './routes/delete';
import { router as newRouter } from './routes/new';
import { router as showRouter } from './routes/show';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(indexRouter);
app.use(deleteRouter);
app.use(newRouter);
app.use(showRouter);


app.all('*', async () => {
  throw new NotFoundError();
})
app.use(errorHandler);

export { app };