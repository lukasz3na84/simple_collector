import axios from "axios";
import * as cheerio from "cheerio";

export async function getTotalPagesByNextButton(baseUrl: string) {
  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      const url = `${baseUrl}page/${currentPage}/`;
      console.log(`Sprawdzanie: ${url}`);
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Szukamy przycisku "Next" w paginacji
      hasNextPage = $(".pager .next").length > 0;

      // Jeśli nie ma linku "Next", to kończymy pętlę
      if (hasNextPage) {
        currentPage++;
      } else {
        break;
      }
    } catch (error: any) {
      console.error("Błąd przy pobieraniu strony:", error.message);
      break;
    }
  }

  return currentPage;
}