import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";

const BASE_URL = "https://intervyo.onrender.com/api/analytics";

export const getUserAnalytics = async (token, timeRange = 30) => {
  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}?timeRange=${timeRange}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Analytics fetch error:", error);
    toast.error("Failed to load analytics");
    throw error;
  }
};

export const getSkillRadar = async (token) => {
  try {
    const response = await apiConnector("GET", `${BASE_URL}/skills`, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Skill radar fetch error:", error);
    throw error;
  }
};
