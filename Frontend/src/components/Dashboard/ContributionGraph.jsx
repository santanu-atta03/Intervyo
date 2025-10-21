import React, { useMemo } from 'react';
import { Activity, TrendingUp, Calendar, Zap } from 'lucide-react';

const ContributionGraph = ({ interviews = [] }) => {
  // Generate contribution data from interviews
  const contributionData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // Last 365 days

    // Create a map of dates with interview counts
    const dateMap = {};
    
    interviews.forEach(interview => {
      const date = new Date(interview.completedAt || interview.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = {
          count: 0,
          scores: [],
          interviews: []
        };
      }
      
      dateMap[dateKey].count += 1;
      dateMap[dateKey].scores.push(interview.overallScore || 0);
      dateMap[dateKey].interviews.push(interview);
    });

    // Generate 52 weeks of data (365 days)
    const weeks = [];
    let currentDate = new Date(startDate);
    
    for (let week = 0; week < 52; week++) {
      const days = [];
      
      for (let day = 0; day < 7; day++) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const dayData = dateMap[dateKey] || { count: 0, scores: [], interviews: [] };
        
        days.push({
          date: new Date(currentDate),
          dateKey,
          count: dayData.count,
          avgScore: dayData.scores.length > 0 
            ? Math.round(dayData.scores.reduce((a, b) => a + b, 0) / dayData.scores.length)
            : 0,
          interviews: dayData.interviews
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(days);
    }

    return weeks;
  }, [interviews]);

  // Get color intensity based on interview count
  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-800/50 border-gray-700/30';
    if (count === 1) return 'bg-emerald-500/30 border-emerald-500/40';
    if (count === 2) return 'bg-emerald-500/50 border-emerald-500/60';
    if (count === 3) return 'bg-emerald-500/70 border-emerald-500/80';
    return 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20';
  };

  // Calculate stats
  const totalContributions = interviews.length;
  
  // Get months for labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      const hasInterview = interviews.some(interview => {
        const interviewDate = new Date(interview.completedAt || interview.createdAt);
        return interviewDate.toISOString().split('T')[0] === dateKey;
      });
      
      if (hasInterview) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }, [interviews]);

  // Calculate longest streak
  const longestStreak = useMemo(() => {
    let maxStreak = 0;
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 364; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      const hasInterview = interviews.some(interview => {
        const interviewDate = new Date(interview.completedAt || interview.createdAt);
        return interviewDate.toISOString().split('T')[0] === dateKey;
      });
      
      if (hasInterview) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }, [interviews]);

  // Get month positions
  const monthPositions = useMemo(() => {
    const positions = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);
    
    let lastMonth = -1;
    
    contributionData.forEach((week, weekIdx) => {
      const weekDate = week[0].date;
      const month = weekDate.getMonth();
      
      if (month !== lastMonth) {
        positions.push({
          week: weekIdx,
          month: months[month]
        });
        lastMonth = month;
      }
    });
    
    return positions;
  }, [contributionData]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 shadow-xl mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Activity Overview
        </h2>
        <div className="text-sm text-gray-400">
          {totalContributions} interviews in the last year
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalContributions}</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-400">Current</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Longest</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{longestStreak}</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Avg Score</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {interviews.length > 0 
              ? Math.round(interviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) / interviews.length)
              : 0}%
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/20">
        <div className="relative overflow-x-auto">
          {/* Month labels */}
          <div className="flex mb-2 relative" style={{ marginLeft: '28px' }}>
            {monthPositions.map((pos, idx) => (
              <div
                key={idx}
                className="text-[10px] text-gray-500 absolute"
                style={{ 
                  left: `${pos.week * 14}px`
                }}
              >
                {pos.month}
              </div>
            ))}
          </div>

          {/* Graph */}
          <div className="flex gap-[3px] mt-6">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] text-[10px] text-gray-500 justify-around pr-2">
              <div style={{ height: '12px' }}>Mon</div>
              <div style={{ height: '12px' }}></div>
              <div style={{ height: '12px' }}>Wed</div>
              <div style={{ height: '12px' }}></div>
              <div style={{ height: '12px' }}>Fri</div>
              <div style={{ height: '12px' }}></div>
              <div style={{ height: '12px' }}></div>
            </div>

            {/* Contribution squares */}
            <div className="flex gap-[3px]">
              {contributionData.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`w-[12px] h-[12px] rounded-[2px] border transition-all duration-200 hover:ring-2 hover:ring-emerald-400/50 hover:scale-125 cursor-pointer ${getColorClass(day.count)}`}
                      title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${day.count} interview${day.count !== 1 ? 's' : ''}${day.avgScore > 0 ? ` (Avg: ${day.avgScore}%)` : ''}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-[10px] text-gray-500">Less</span>
            <div className="flex gap-[3px]">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-[12px] h-[12px] rounded-[2px] border ${getColorClass(level)}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;