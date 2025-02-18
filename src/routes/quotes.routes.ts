import { Request, Response, Router } from "express";
import { fetchQuotesHandler } from "../controllers/quotes.controller";

const quotesRouter = Router();

quotesRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

quotesRouter.get("/fetch-quotes", fetchQuotesHandler);


export default quotesRouter;
