import React, { useMemo, useEffect, useRef } from 'react';
import { Activity, TrendingUp, Calendar, Zap } from 'lucide-react';

const ContributionGraph = ({ interviews = [] }) => {
  const scrollContainerRef = useRef(null);

  // Generate contribution data from interviews (reversed for LeetCode style)
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

    // Reverse weeks array so most recent is first (right side)
    return weeks.reverse();
  }, [interviews]);

  // Get color intensity based on interview count (LeetCode style)
  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-800/20';
    if (count === 1) return 'bg-emerald-600/25';
    if (count === 2) return 'bg-emerald-600/45';
    if (count === 3) return 'bg-emerald-500/65';
    return 'bg-emerald-500/85';
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

  // Get month positions (reversed)
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

  // Scroll to the end (most recent) on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-800/60 p-6 shadow-2xl mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          {totalContributions} interviews in the last year
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900/60 rounded-md p-3 border border-gray-800/40">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-xl font-bold text-gray-200">{totalContributions}</div>
        </div>
        
        <div className="bg-gray-900/60 rounded-md p-3 border border-gray-800/40">
          <div className="text-xs text-gray-500 mb-1">Current Streak</div>
          <div className="text-xl font-bold text-orange-400">{currentStreak} days</div>
        </div>
        
        <div className="bg-gray-900/60 rounded-md p-3 border border-gray-800/40">
          <div className="text-xs text-gray-500 mb-1">Longest Streak</div>
          <div className="text-xl font-bold text-purple-400">{longestStreak} days</div>
        </div>
        
        <div className="bg-gray-900/60 rounded-md p-3 border border-gray-800/40">
          <div className="text-xs text-gray-500 mb-1">Avg Score</div>
          <div className="text-xl font-bold text-emerald-400">
            {interviews.length > 0 
              ? Math.round(interviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) / interviews.length)
              : 0}%
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="bg-gray-950/40 rounded-md border border-gray-800/40 relative">
        <style>{`
          .contribution-scroll::-webkit-scrollbar {
            height: 6px;
          }
          .contribution-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .contribution-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(55, 65, 81, 0.3);
            border-radius: 3px;
          }
          .contribution-scroll::-webkit-scrollbar-thumb:hover {
            background-color: rgba(55, 65, 81, 0.5);
          }
          .contribution-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(55, 65, 81, 0.3) transparent;
          }
        `}</style>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="contribution-scroll overflow-x-auto overflow-y-hidden py-4 px-3"
        >
          <div className="inline-block">
            {/* Month labels */}
            <div className="flex mb-2 relative h-4" style={{ marginLeft: '20px' }}>
              {monthPositions.map((pos, idx) => (
                <div
                  key={idx}
                  className="text-[11px] text-gray-500 font-medium absolute"
                  style={{ 
                    left: `${pos.week * 13}px`
                  }}
                >
                  {pos.month}
                </div>
              ))}
            </div>

            {/* Graph */}
            <div className="flex gap-[2px]">
              {/* Day labels */}
              <div className="flex flex-col gap-[2px] text-[11px] text-gray-600 pr-2 pt-[2px]">
                <div className="h-[9px] leading-[9px]">Mon</div>
                <div className="h-[9px]"></div>
                <div className="h-[9px] leading-[9px]">Wed</div>
                <div className="h-[9px]"></div>
                <div className="h-[9px] leading-[9px]">Fri</div>
                <div className="h-[9px]"></div>
                <div className="h-[9px]"></div>
              </div>

              {/* Contribution squares */}
              <div className="flex gap-[2px]">
                {contributionData.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[2px]">
                    {week.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={`w-[9px] h-[9px] rounded-sm transition-all duration-100 hover:ring-1 hover:ring-emerald-400/60 hover:scale-125 cursor-pointer ${getColorClass(day.count)}`}
                        title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${day.count} interview${day.count !== 1 ? 's' : ''}${day.avgScore > 0 ? ` (Avg: ${day.avgScore}%)` : ''}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 ml-[20px]">
              <span className="text-[11px] text-gray-600">Less</span>
              <div className="flex gap-[2px]">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-[9px] h-[9px] rounded-sm ${getColorClass(level)}`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-600">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;