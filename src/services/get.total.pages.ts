import axios from "axios";
import * as cheerio from "cheerio";

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
