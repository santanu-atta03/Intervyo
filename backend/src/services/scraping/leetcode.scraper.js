import axios from "axios";

export async function scrapeLeetCode(username) {
  try {
    const url = `https://leetcode-stats.tashif.codes/${username}`;
    const response = await axios.get(url, { timeout: 10000 });

    return {
      platform: "LEETCODE",
      username,
      data: response.data
    };
  } catch (err) {
    throw new Error("Failed to fetch LeetCode data");
  }
}
