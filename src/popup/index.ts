import "./styles.css";
import axios from "axios";

interface Book {
  title: string;
  price: number;
  stock: boolean;
  buyLink: string;
  darazPrice?: number;
}

document.addEventListener("DOMContentLoaded", () => {
  // @ts-ignore
  chrome.storage?.local?.get(["bookData"], (result: { bookData?: Book[] }) => {
    const books: Book[] = result?.bookData || [];
    const app = document.getElementById("app");
    if (app && books.length > 0) {
      app.innerHTML = `
        <h2 class="text-lg font-bold mb-2">Price Comparison</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-blue-700">
              <th class="p-2 text-left">Title</th>
              <th class="p-2 text-left">Books Mandala Price</th>
              <th class="p-2 text-left">Stock</th>
              <th class="p-2 text-left">Buy Link</th>
              <th class="p-2 text-left">Daraz Price</th>
            </tr>
          </thead>
          <tbody>
            ${books
              .map(
                (book) => `
                  <tr class="border-t border-gray-700">
                    <td class="p-2">${book.title}</td>
                    <td class="p-2">NPR ${book.price}</td>
                    <td class="p-2">${book.stock ? "In Stock" : "Out of Stock"}</td>
                    <td class="p-2"><a href="${book.buyLink}" target="_blank" class="text-blue-400 hover:underline">Buy Now</a></td>
                    <td class="p-2">${book.darazPrice ? `NPR ${book.darazPrice}` : "N/A"}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `;
    } else if (app) {
      app.innerHTML = '<p class="text-red-500">No data available. Search a book or visit a product page.</p>';
    }
  });
});