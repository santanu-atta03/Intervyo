// ============================================
// CUSTOM HOOK FOR DASHBOARD DATA
// File: src/hooks/useDashboard.js
// ============================================

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const API_URL = 'https://intervyo.onrender.com/api';

export const useDashboard = () => {
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentInterviews: [],
    learningProgress: [],
    badges: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Fetch all dashboard data in parallel
      const [statsRes, interviewsRes, progressRes, badgesRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`, config),
        axios.get(`${API_URL}/dashboard/interviews/recent?limit=5`, config),
        axios.get(`${API_URL}/dashboard/learning-progress`, config),
        axios.get(`${API_URL}/dashboard/badges`, config)
      ]);

      setDashboardData({
        stats: statsRes.data.data,
        recentInterviews: interviewsRes.data.data || [],
        learningProgress: progressRes.data.data || [],
        badges: badgesRes.data.data || []
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/dashboard/update-streak`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error updating streak:', err);
      return null;
    }
  };

  const awardXP = async (xpAmount, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/dashboard/award-xp`,
        { xpAmount, reason },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Refresh stats after awarding XP
      await fetchDashboardData();
      
      return response.data;
    } catch (err) {
      console.error('Error awarding XP:', err);
      return null;
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    loading,
    error,
    dashboardData,
    updateStreak,
    awardXP,
    refreshData
  };
};

// ============================================
// USAGE IN YOUR DASHBOARD COMPONENT
// ============================================
/*
import { useDashboard } from '../hooks/useDashboard';

export default function Dashboard() {
  const { user } = useSelector((state) => state.profile);
  const { 
    loading, 
    error, 
    dashboardData, 
    updateStreak, 
    awardXP,
    refreshData 
  } = useDashboard();

  // Use dashboardData.stats, dashboardData.recentInterviews, etc.
  
  // Call updateStreak() when user completes an interview
  // Call awardXP(100, 'Interview completed') to award points
  // Call refreshData() to manually refresh all data
}
*/