import axios from "axios";

export async function scrapeGitHub(username) {
  try {
    // Fetch public events
    const res = await axios.get(`https://api.github.com/users/${username}/events/public`);
    const events = res.data;

    const today = new Date();

    // Count events in the last 7 days (simple activity metric)
    const recentActivity = events.filter(event => {
      const eventDate = new Date(event.created_at);
      const diffDays = (today - eventDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    });

    return {
      platform: "GITHUB",
      username,
      data: {
        totalEvents: events.length,
        recentActivityCount: recentActivity.length,
        message: "retrieved",
        status: "success"
      }
    };
  } catch (err) {
    return {
      platform: "GITHUB",
      username,
      data: {
        status: "fail",
        message: err.message
      }
    };
  }
}
