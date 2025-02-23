import { Request, Response } from "express";
import { IProduct } from "../Interfaces/books";
import { BadRequestError } from "../errors/BadRequestError";
import { scrapeAllQuotesMinMaxPage } from "../services/quotes.to.scrape";
import { IQuote } from "../Interfaces/quotes";
import { getTotalPages } from "../services/utils/get.total.pages.by.pages";
import { getTotalPagesByNextButton } from "../services/utils/get.total.pages.by.next.button";

export async function fetchQuotesHandler(req: Request, res: Response) {
  const from = parseInt(req.query.from as string, 10);
  const to = parseInt(req.query.to as string, 10);
  let quotes: IQuote[] = [];
  const homePageUrl: string = "https://quotes.toscrape.com/";

  if (!from && !to) {
    const nrPages = (await getTotalPagesByNextButton(homePageUrl)) ?? 1;
    quotes = await scrapeAllQuotesMinMaxPage(1, nrPages);
    res.status(200).json(quotes);
    return;
  } else {
    if (isNaN(from) || isNaN(to) || from > to || from < 1) {
      throw new BadRequestError("Invalid page range");
    }
    quotes = await scrapeAllQuotesMinMaxPage(from, to);
    res.status(200).json(quotes);
    return;
  }
}
