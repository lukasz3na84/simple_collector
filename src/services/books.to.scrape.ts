import axios from "axios";
import * as cheerio from "cheerio";
import path from "path";
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
      const cachedData = await redis.get(url);
      if (cachedData) {
        console.log(`Załadowano z cache: ${url}`);
        allBooks.push(...JSON.parse(cachedData));
        continue;
      }
      // Pobranie danych i zapis do cache
      const books = await scrapeBooksPage(url);
      await redis.set(url, JSON.stringify(books), { EX: 60 }); // Cache na 1min
      allBooks.push(...books);
    } catch (error) {
      console.error(`Błąd przy pobieraniu strony ${url}:`, error);
    }
  }

  return allBooks;
}

export async function getTotalPages(url: string): Promise<number | null> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // Pobieramy tekst z elementu paginacji (np. "Page 1 of 50")
    const paginationText = $(".current").text().trim();
    // Używamy wyrażenia regularnego, aby wyłuskać liczbę stron
    const regex = /Page\s+\d+\s+of\s+(\d+)/i;
    const match = paginationText.match(regex);

    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    // Jeśli nie znaleziono paginacji, zakładamy, że jest tylko jedna strona
    return 1;
  } catch (error: any) {
    console.error("Błąd podczas pobierania strony:", error.message);
    return null;
  }
}
