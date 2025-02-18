import { Request, Response } from "express";
import { IProduct } from "../Interfaces/books";
import {
  getTotalPages,
  scrapeAllBooksMinMaxPage,
} from "../services/books.to.scrape";
import { BadRequestError } from "../errors/BadRequestError";

export async function fetchBookHandler(req: Request, res: Response) {
  const from = parseInt(req.query.from as string, 10);
  const to = parseInt(req.query.to as string, 10);
  let books: IProduct[] = [];
  const homePageUrl: string = "http://books.toscrape.com/";

  if (!from && !to) {
    const nrPages = (await getTotalPages(homePageUrl)) ?? 1;
    books = await scrapeAllBooksMinMaxPage(1, nrPages);
    res.status(200).json(books);
    return;
  } else {
    if (isNaN(from) || isNaN(to) || from > to || from < 1) {
      throw new BadRequestError("Invalid page range");
    }
    books = await scrapeAllBooksMinMaxPage(from, to);
    res.status(200).json(books);
    return;
  }
}
