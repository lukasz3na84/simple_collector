import { Router } from "express";
import { fetchQuotesHandler } from "../controllers/quotes.controller";

const quotesRouter = Router();

quotesRouter.get('/', (req, res) => {
  res.send('Hello world');
});

quotesRouter.get("/fetch-quotes", fetchQuotesHandler);


export default quotesRouter;
