import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Activity, AlertCircle } from 'lucide-react';

const PerformanceChart = ({ data, detailed = false }) => {
  // CRITICAL FIX: Validate and transform data
  const chartData = React.useMemo(() => {
    // Handle undefined/null data
    if (!data) {
      console.warn('PerformanceChart: No data provided');
      return [];
    }

    // If data is already an array, return it
    if (Array.isArray(data)) {
      return data;
    }

    // If data is an object with a data property that's an array
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    // If data is an object, try to convert it to array format
    if (typeof data === 'object') {
      // Check if it has timeline property
      if (data.timeline && Array.isArray(data.timeline)) {
        return data.timeline;
      }

      // Check if it has questions property
      if (data.questions && Array.isArray(data.questions)) {
        return data.questions.map((q, idx) => ({
          questionNumber: idx + 1,
          score: q.score || 0,
          timeTaken: q.timeTaken || 0
        }));
      }

      // Try to convert object to array
      console.warn('PerformanceChart: Converting object to array', data);
      return [];
    }

    console.warn('PerformanceChart: Invalid data format', data);
    return [];
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">
            Question {payload[0].payload.questionNumber}
          </p>
          <p className="text-blue-600 font-medium">
            Score: {payload[0].value}%
          </p>
          {payload[0].payload.timeTaken && (
            <p className="text-gray-600 text-sm">
              Time: {payload[0].payload.timeTaken}s
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // If no valid data, show empty state
  if (!chartData || chartData.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-800">Performance Over Time</h3>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No Performance Data Available</p>
          <p className="text-gray-400 text-sm mt-2">
            Complete more questions to see your performance chart
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-800">Performance Over Time</h3>
        <span className="ml-auto text-sm text-gray-500">
          {chartData.length} questions
        </span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={detailed ? 400 : 300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="questionNumber" 
              stroke="#6b7280"
              label={{ value: 'Question Number', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="#6b7280"
              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#667eea"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {detailed && chartData.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Trend</p>
              <p className="text-lg font-bold text-gray-800">
                {chartData[chartData.length - 1]?.score > chartData[0]?.score 
                  ? 'Improving ↑' 
                  : chartData[chartData.length - 1]?.score < chartData[0]?.score
                  ? 'Declining ↓'
                  : 'Stable →'}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Best Performance</p>
              <p className="text-lg font-bold text-gray-800">
                Q{chartData.reduce((max, item) => 
                  (item.score || 0) > (max.score || 0) ? item : max
                ).questionNumber}
                <span className="text-sm text-gray-600 ml-1">
                  ({Math.round(chartData.reduce((max, item) => 
                    (item.score || 0) > (max.score || 0) ? item : max
                  ).score)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PerformanceChart;