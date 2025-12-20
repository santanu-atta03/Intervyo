import { detectPlatformAndUsername } from "../src/services/platformDetector.service.js";
import { scrapeLeetCode } from "../src/services/scraping/leetcode.scraper.js";
import { normalizeLeetCode } from "../src/services/normalization/leetcode.normalizer.js";

const input = "https://leetcode.com/Yugen_n847";

const { platform, username } = detectPlatformAndUsername(input);

let result;

if (platform === "LEETCODE") {
  result = await scrapeLeetCode(username);
}

console.log("Raw:", result);

const normalized = normalizeLeetCode(result.data);
console.log("Normalized:", normalized);
