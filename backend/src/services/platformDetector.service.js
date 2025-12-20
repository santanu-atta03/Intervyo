import { PLATFORMS } from "../constants/platforms.js";

// Single function that detects platform and extracts username
export function detectPlatformAndUsername(profileUrl) {
  if (!profileUrl || typeof profileUrl !== "string") {
    throw new Error("Invalid profile URL");
  }

  const url = profileUrl.toLowerCase();

  if (url.includes("leetcode.com")) {
    return {
      platform: PLATFORMS.LEETCODE,
      username: extractUsername(url, "leetcode.com/")
    };
  }

  if (url.includes("codeforces.com")) {
    return {
      platform: PLATFORMS.CODEFORCES,
      username: extractUsername(url, "profile/")
    };
  }

  if (url.includes("github.com")) {
    return {
      platform: PLATFORMS.GITHUB,
      username: extractUsername(url, "github.com/")
    };
  }

  if (url.includes("codechef.com")) {
    return {
      platform: PLATFORMS.CODECHEF,
      username: extractUsername(url, "users/")
    };
  }

  if (url.includes("atcoder.jp")) {
    return {
      platform: PLATFORMS.ATCODER,
      username: extractUsername(url, "users/")
    };
  }

  throw new Error("Unsupported platform");
}

// Helper to extract username
function extractUsername(url, marker) {
  const idx = url.indexOf(marker);
  if (idx === -1) throw new Error("Invalid profile URL");

  return url.substring(idx + marker.length).split("/")[0];
}
