import axios from "axios";

interface Book {
  isbn?: string;
  title: string;
  price: number;
  stock: boolean;
  buyLink: string;
  darazPrice?: number;
}

const isGoogleSearch = () => window.location.host.includes("google.com") && window.location.pathname.includes("/search");
const isDarazPage = () => window.location.host.includes("daraz.com.np");
const isBooksMandalaPage = () => window.location.host.includes("booksmandala.com");

const extractSearchQuery = (): string | null => {
  if (isGoogleSearch()) {
    const q = new URLSearchParams(window.location.search).get("q");
    return q?.match(/[\w\s]+(?=\sbook|\snovel)/i)?.[0] || q || null;
  }
  return null;
};

const extractDarazPrice = (): number | null => {
  if (isDarazPage()) {
    const priceElement = document.querySelector(".pdp-price") as HTMLElement;
    const priceText = priceElement?.textContent?.replace(/[^0-9.]/g, "");
    return priceText ? parseFloat(priceText) : null;
  }
  return null;
};

const sendMessageToBackground = async (query: string | null, darazPrice: number | null) => {
  if (query) {
    const response = await axios.get(`https://openapi.mitnpl.com/search?q=${encodeURIComponent(query)}`);
    const books = response.data;
    (window as any).chrome?.runtime?.sendMessage({
      type: "SEARCH_RESULT",
      data: books.map((book: any) => ({
        title: book.title,
        price: book.price,
        stock: book.stock,
        buyLink: book.url || `https://booksmandala.com/book/${book.isbn}`,
        darazPrice,
      })),
    });
  } else if (darazPrice) {
    const isbn = (document.querySelector("[data-isbn]") as HTMLElement)?.dataset.isbn;
    if (isbn) {
      const response = await axios.get(`https://openapi.mitnpl.com/books/${isbn}`);
      const book = response.data;
      (window as any).chrome?.runtime?.sendMessage({
        type: "PAGE_PRICE",
        data: {
          title: book.title,
          price: book.price,
          stock: book.stock,
          buyLink: book.url || `https://booksmandala.com/book/${isbn}`,
          darazPrice,
        },
      });
    }
  }
};

if (isGoogleSearch()) {
  const query = extractSearchQuery();
  sendMessageToBackground(query, null);
} else if (isDarazPage() || isBooksMandalaPage()) {
  const darazPrice = extractDarazPrice();
  sendMessageToBackground(null, darazPrice);
}