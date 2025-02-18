import { Request, Response, Router } from "express";
import { fetchBookHandler } from "../controllers/book.controller";
import { BadRequestError } from "../errors/BadRequestError";
import { fetchQuotesHandler } from "../controllers/quotes.controller";

const quotesRouter = Router();

quotesRouter.get('/', (req, res) => {
  res.send('Hello world');
});

quotesRouter.get("/fetch-quotes", fetchQuotesHandler);


export default quotesRouter;
