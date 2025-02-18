import axios from "axios";
import * as cheerio from "cheerio";
import { getRedisClient } from "../utils/reddis.connection";
import { IQuote } from "../Interfaces/quotes";

export async function scrapeQuotesPage(pageUrl: string): Promise<IQuote[]> {
  try {
    const { data } = await axios.get(pageUrl);
    const $ = cheerio.load(data);
    const quotes: IQuote[] = [];

    $(".quote").each((i, elem) => {
      const quote = $(elem).find(".text").text().trim(); // Pobiera tylko cytat
      const author = $(elem).find(".author").text().trim(); // Pobiera autora
      quotes.push({ quote, author });
    });
    return quotes;
  } catch (error: any) {
    console.error(`Błąd podczas pobierania strony ${pageUrl}:`, error.message);
    return [];
  }
}

export async function scrapeAllQuotesMinMaxPage(
  min: number,
  max: number
): Promise<IQuote[]> {
  const baseUrl = "https://quotes.toscrape.com/page/";
  const allBooks: IQuote[] = [];
  const redis = await getRedisClient();

  for (let page = min; page <= max; page++) {
    const url = `${baseUrl}${page}/`;
    console.log(`Pobieranie danych ze strony: ${url}`);

    try {
      const cachedData = await redis.get(`quotes:${url}`);
      if (cachedData) {
        console.log(`Załadowano z cache: ${url}`);
        allBooks.push(...JSON.parse(cachedData));
        continue;
      }
      // Pobranie danych i zapis do cache
      const books = await scrapeQuotesPage(url);
      await redis.set(`quotes:${url}`, JSON.stringify(books), { EX: 60 }); // Cache na 1min
      allBooks.push(...books);
    } catch (error) {
      console.error(`Błąd przy pobieraniu strony ${url}:`, error);
    }
  }

  return allBooks;
}