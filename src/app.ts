import express, { Express, Request, Response } from 'express';
import bookRouter from './routes/book.routes'; // upewnij się, że ścieżka jest poprawna
import dotenv from 'dotenv';
// import { errorHandler } from './middlewares/error.handler.middleware';
import { errorHandler } from './middlewares/error.handler.middleware';

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use("/books", bookRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

const host = process.env.HOST ?? 'localhost';
const port = Number(process.env.PORT) || 1337;

// app.use(errorHandlerMiddleware);
app.use(errorHandler);

app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});
