import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';

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
    if (count === 0) return 'bg-gray-800 border-gray-700';
    if (count === 1) return 'bg-emerald-900/40 border-emerald-800/50';
    if (count === 2) return 'bg-emerald-700/60 border-emerald-600/70';
    if (count === 3) return 'bg-emerald-600/80 border-emerald-500/90';
    return 'bg-emerald-500 border-emerald-400';
  };

  // Calculate stats
  const totalContributions = interviews.length;
  const currentYear = new Date().getFullYear();
  
  // Get months for labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabels = useMemo(() => {
    const labels = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);
    
    let currentMonth = startDate.getMonth();
    
    for (let week = 0; week < 52; week += 4) {
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + (week * 7));
      const month = weekDate.getMonth();
      
      if (month !== currentMonth || week === 0) {
        labels.push({ week, month: months[month] });
        currentMonth = month;
      }
    }
    
    return labels;
  }, []);

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
        // If we hit a day without interview (and it's not today), stop counting
        break;
      }
    }
    
    return streak;
  }, [interviews]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          {totalContributions} interviews in the last year
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm border ${getColorClass(level)}`}
                />
              ))}
            </div>
            <span className="text-gray-400">More</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-2 pl-8">
          {monthLabels.map((label, idx) => (
            <div
              key={idx}
              className="text-xs text-gray-500"
              style={{ 
                position: 'absolute',
                left: `${32 + (label.week * 12)}px`
              }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Graph */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-gray-500 justify-around pr-2 pt-5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Contribution squares */}
          <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {contributionData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`w-3 h-3 rounded-sm border transition-all duration-200 hover:ring-2 hover:ring-emerald-400 hover:scale-125 cursor-pointer ${getColorClass(day.count)}`}
                    title={`${day.date.toLocaleDateString()}: ${day.count} interview${day.count !== 1 ? 's' : ''}${day.avgScore > 0 ? ` (Avg: ${day.avgScore}%)` : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-700/50">
          <div>
            <div className="text-2xl font-bold text-white">{totalContributions}</div>
            <div className="text-xs text-gray-400">Total interviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{currentStreak}</div>
            <div className="text-xs text-gray-400">Current streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {interviews.length > 0 
                ? Math.round(interviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) / interviews.length)
                : 0}%
            </div>
            <div className="text-xs text-gray-400">Average score</div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </div>
  );
};

export default ContributionGraph;