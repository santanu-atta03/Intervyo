// services/achievementService.js

const API_BASE_URL = 'https://intervyo.onrender.com/api';

export const achievementService = {
  // Check for new achievements
  checkAchievements: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return { success: false, data: { newAchievements: [] } };
    }
  },

  // Get all achievements
  getAllAchievements: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return { success: false, data: { all: [], grouped: {} } };
    }
  },

  // Mark achievement as notified
  markAsNotified: async (achievementId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements/mark-notified/${achievementId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking achievement as notified:', error);
      return { success: false };
    }
  },

  // Initialize achievements (run once)
  initializeAchievements: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/achievements/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initializing achievements:', error);
      return { success: false };
    }
  }
};