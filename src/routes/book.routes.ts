import { Router } from "express";
import { fetchBookHandler } from "../controllers/book.controller";
import { BadRequestError } from "../errors/BadRequestError";

const bookRouter = Router();

bookRouter.get('/', (req, res) => {
  res.send('Hello world');
});

bookRouter.get("/fetch-books", fetchBookHandler);
bookRouter.get("/error-test", () => {
  throw new BadRequestError('Test');
});


export default bookRouter;
