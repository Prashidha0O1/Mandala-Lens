(globalThis as any).chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === "SEARCH_RESULT" || message.type === "PAGE_PRICE") {
    (globalThis as any).chrome.action.setBadgeText({ text: "✓" });
    (globalThis as any).chrome.storage.local.set({ bookData: message.data }, () => {
      (globalThis as any).chrome.action.openPopup();
      });
    }
  });