import axios from "axios";
import * as cheerio from "cheerio";
import { IProduct } from "../Interfaces/books";
import { getRedisClient } from "../utils/reddis.connection";

export async function scrapeBooksPage(pageUrl: string): Promise<IProduct[]> {
  try {
    const { data } = await axios.get(pageUrl);
    const $ = cheerio.load(data);
    const books: IProduct[] = [];

    // Każdy produkt na stronie ma klasę .product_pod
    $(".product_pod").each((i, elem) => {
      const title = $(elem).find("h3 a").attr("title")?.trim();
      const price = $(elem).find(".price_color").text().trim();
      books.push({ title, price });
    });
    return books;
  } catch (error: any) {
    console.error(`Błąd podczas pobierania strony ${pageUrl}:`, error.message);
    return [];
  }
}

export async function scrapeAllBooksMinMaxPage(
  min: number,
  max: number
): Promise<IProduct[]> {
  const baseUrl = "http://books.toscrape.com/catalogue/page-";
  const allBooks: IProduct[] = [];
  const redis = await getRedisClient();

  for (let page = min; page <= max; page++) {
    const url = `${baseUrl}${page}.html`;
    console.log(`Pobieranie danych ze strony: ${url}`);

    try {
      const cachedData = await redis.get(`books:${url}`);
      if (cachedData) {
        console.log(`Załadowano z cache: ${url}`);
        allBooks.push(...JSON.parse(cachedData));
        continue;
      }
      // Pobranie danych i zapis do cache
      const books = await scrapeBooksPage(url);
      await redis.set(`books:${url}`, JSON.stringify(books), { EX: 60 }); // Cache na 1min
      allBooks.push(...books);
    } catch (error) {
      console.error(`Błąd przy pobieraniu strony ${url}:`, error);
    }
  }

  return allBooks;
}