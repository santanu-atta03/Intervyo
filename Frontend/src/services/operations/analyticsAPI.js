import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";
import { analyticsEndpoints } from "../apis";

const { GET_USER_ANALYTICS_API, GET_SKILL_RADAR_API } = analyticsEndpoints;

export const getUserAnalytics = async (token, timeRange = 30) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_USER_ANALYTICS_API}?timeRange=${timeRange}`,
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
    const response = await apiConnector("GET", GET_SKILL_RADAR_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Skill radar fetch error:", error);
    throw error;
  }
};
