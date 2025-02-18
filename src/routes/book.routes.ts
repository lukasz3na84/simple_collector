import { Request, Response, Router } from "express";
import { fetchBookHandler } from "../controllers/book.controller";
import { BadRequestError } from "../errors/BadRequestError";

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});

router.get("/fetch-pages", fetchBookHandler);
router.get("/error-test", () => {
  throw new BadRequestError('Test');
});


export default router;
