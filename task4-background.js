let startTime = Date.now();
let currentDomain = null;

const productiveSites = [
  "github.com",
  "leetcode.com",
  "stackoverflow.com",
  "geeksforgeeks.org"
];

const unproductiveSites = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "youtube.com"
];

function classify(domain) {
  if (productiveSites.includes(domain)) return "Productive";
  if (unproductiveSites.includes(domain)) return "Unproductive";
  return "Neutral";
}

function handleTabChange() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (!tabs || !tabs[0] || !tabs[0].url) return;

    const now = Date.now();
    const newDomain = new URL(tabs[0].url).hostname;

    if (currentDomain) {
      const timeSpent = now - startTime;
      const category = classify(currentDomain);

      chrome.storage.local.get([currentDomain], (result) => {
        const prev = result[currentDomain];

        const totalTime =
          prev && typeof prev.time === "number"
            ? prev.time + timeSpent
            : timeSpent;

        chrome.storage.local.set({
          [currentDomain]: {
            time: totalTime,
            category
          }
        });
      });
    }

    currentDomain = newDomain;
    startTime = now;
  });
}

chrome.tabs.onActivated.addListener(handleTabChange);
chrome.tabs.onUpdated.addListener((_, info) => {
  if (info.status === "complete") handleTabChange();
});
chrome.windows.onFocusChanged.addListener(handleTabChange);