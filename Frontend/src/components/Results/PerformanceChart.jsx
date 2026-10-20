import React from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import "../../styles/resultsComponents.css";

const clamp = (value) =>
  Math.max(0, Math.min(100, Number(value) || 0));

const PerformanceChart = ({ data, detailed = false }) => {
  const chartData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        questionNumber:
          item.questionNumber || item.question || index + 1,
        score: clamp(item.score),
        avgScore:
          item.avgScore !== undefined ? clamp(item.avgScore) : undefined,
        timeTaken: item.timeTaken || item.timeSpent || 0,
        category: item.category || "general",
      }));
    }

    if (Array.isArray(data.data)) {
      return data.data.map((item, index) => ({
        questionNumber:
          item.questionNumber || item.question || index + 1,
        score: clamp(item.score),
        avgScore:
          item.avgScore !== undefined ? clamp(item.avgScore) : undefined,
        timeTaken: item.timeTaken || item.timeSpent || 0,
        category: item.category || "general",
      }));
    }

    if (Array.isArray(data.timeline)) {
      return data.timeline.map((item, index) => ({
        questionNumber:
          item.questionNumber || item.question || index + 1,
        score: clamp(item.score),
        avgScore:
          item.avgScore !== undefined ? clamp(item.avgScore) : undefined,
        timeTaken: item.timeTaken || item.timeSpent || 0,
        category: item.category || "general",
      }));
    }

    if (Array.isArray(data.questions)) {
      return data.questions.map((item, index) => ({
        questionNumber:
          item.questionNumber || item.question || index + 1,
        score: clamp(item.score),
        avgScore:
          item.avgScore !== undefined ? clamp(item.avgScore) : undefined,
        timeTaken: item.timeTaken || item.timeSpent || 0,
        category: item.category || "general",
      }));
    }

    return [];
  }, [data]);

  const statistics = React.useMemo(() => {
    if (!chartData.length) {
      return {
        firstScore: 0,
        lastScore: 0,
        bestQuestion: null,
        averageScore: 0,
        trend: "Stable",
      };
    }

    const firstScore = chartData[0].score;
    const lastScore = chartData[chartData.length - 1].score;

    const bestQuestion = chartData.reduce((best, item) =>
      item.score > best.score ? item : best,
    );

    const averageScore =
      chartData.reduce((sum, item) => sum + item.score, 0) /
      chartData.length;

    let trend = "Stable";

    if (lastScore > firstScore + 2) {
      trend = "Improving";
    } else if (lastScore < firstScore - 2) {
      trend = "Declining";
    }

    return {
      firstScore,
      lastScore,
      bestQuestion,
      averageScore,
      trend,
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const item = payload[0]?.payload;

    return (
      <div
        style={{
          minWidth: 170,
          padding: "13px 15px",
          border: "1px solid var(--rc-hairline)",
          background: "var(--rc-canvas)",
          color: "var(--rc-ink)",
          boxShadow: "0 12px 30px rgba(17, 17, 17, .12)",
        }}
      >
        <div
          style={{
            marginBottom: 8,
            fontSize: 12,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: ".04em",
            color: "var(--rc-mute)",
          }}
        >
          Question {item.questionNumber}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            fontSize: 14,
          }}
        >
          <span style={{ color: "var(--rc-mute)" }}>Score</span>
          <strong>{Math.round(item.score)}%</strong>
        </div>

        {item.timeTaken > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              marginTop: 6,
              fontSize: 12,
            }}
          >
            <span style={{ color: "var(--rc-mute)" }}>Time</span>
            <span>{item.timeTaken}s</span>
          </div>
        )}

        {item.category && item.category !== "general" && (
          <div
            style={{
              marginTop: 8,
              color: "var(--rc-mute)",
              fontSize: 11,
              textTransform: "capitalize",
            }}
          >
            {item.category}
          </div>
        )}
      </div>
    );
  };

  if (!chartData.length) {
    return (
      <motion.section
        className="results-component"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-labelledby="performance-chart-heading"
      >
        <div className="results-component-header">
          <span className="results-component-header-icon">
            <Activity size={18} />
          </span>

          <div>
            <h3 id="performance-chart-heading">
              Performance over time
            </h3>
            <p className="results-component-subtitle">
              Track your score across the interview questions.
            </p>
          </div>
        </div>

        <div className="results-empty">
          <AlertCircle
            size={30}
            style={{ margin: "0 auto 12px", opacity: 0.55 }}
          />
          <div style={{ color: "var(--rc-ink)", fontWeight: 500 }}>
            No performance data available
          </div>
          <div style={{ marginTop: 6 }}>
            Complete more questions to see your performance trend.
          </div>
        </div>
      </motion.section>
    );
  }

  const trendIsPositive = statistics.trend === "Improving";
  const trendIsNegative = statistics.trend === "Declining";

  return (
    <motion.section
      className="results-component"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="performance-chart-heading"
    >
      <div className="results-component-header">
        <span className="results-component-header-icon">
          <Activity size={18} />
        </span>

        <div>
          <h3 id="performance-chart-heading">
            Performance over time
          </h3>
          <p className="results-component-subtitle">
            Track your score across the interview questions.
          </p>
        </div>

        <span
          style={{
            marginLeft: "auto",
            color: "var(--rc-mute)",
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          {chartData.length} question
          {chartData.length === 1 ? "" : "s"}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: detailed ? 400 : 310,
          marginTop: 24,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 12,
              right: 10,
              left: 0,
              bottom: 8,
            }}
          >
            <CartesianGrid
              stroke="var(--rc-hairline-soft)"
              strokeDasharray="2 5"
              vertical={false}
            />

            <XAxis
              dataKey="questionNumber"
              stroke="var(--rc-mute)"
              tick={{
                fill: "var(--rc-mute)",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={{
                stroke: "var(--rc-hairline)",
              }}
              label={{
                value: "Question",
                position: "insideBottom",
                offset: -2,
                fill: "var(--rc-mute)",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, 100]}
              stroke="var(--rc-mute)"
              tick={{
                fill: "var(--rc-mute)",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              width={38}
              label={{
                value: "Score",
                angle: -90,
                position: "insideLeft",
                fill: "var(--rc-mute)",
                fontSize: 12,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--rc-ink)",
                strokeOpacity: 0.25,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--rc-ink)"
              strokeWidth={2.5}
              fill="var(--rc-ink)"
              fillOpacity={0.08}
              activeDot={{
                r: 5,
                fill: "var(--rc-ink)",
                stroke: "var(--rc-canvas)",
                strokeWidth: 2,
              }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: detailed
            ? "repeat(3, minmax(0, 1fr))"
            : "repeat(2, minmax(0, 1fr))",
          gap: 8,
          marginTop: 24,
        }}
      >
        <div
          style={{
            minHeight: 92,
            padding: 16,
            background: "var(--rc-cloud)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--rc-mute)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: ".04em",
            }}
          >
            {trendIsPositive ? (
              <TrendingUp size={16} />
            ) : trendIsNegative ? (
              <TrendingDown size={16} />
            ) : (
              <Activity size={16} />
            )}
            Trend
          </div>

          <div
            style={{
              marginTop: 13,
              color: "var(--rc-ink)",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {statistics.trend}
          </div>
        </div>

        <div
          style={{
            minHeight: 92,
            padding: 16,
            background: "var(--rc-cloud)",
          }}
        >
          <div
            style={{
              color: "var(--rc-mute)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: ".04em",
            }}
          >
            Average score
          </div>

          <div
            style={{
              marginTop: 13,
              color: "var(--rc-ink)",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {Math.round(statistics.averageScore)}%
          </div>
        </div>

        {detailed && statistics.bestQuestion && (
          <div
            style={{
              minHeight: 92,
              padding: 16,
              background: "var(--rc-cloud)",
            }}
          >
            <div
              style={{
                color: "var(--rc-mute)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".04em",
              }}
            >
              Best performance
            </div>

            <div
              style={{
                marginTop: 13,
                color: "var(--rc-ink)",
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Q{statistics.bestQuestion.questionNumber}
              <span
                style={{
                  marginLeft: 7,
                  color: "var(--rc-mute)",
                  fontSize: 13,
                  fontWeight: 400,
                }}
              >
                {Math.round(statistics.bestQuestion.score)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default PerformanceChart;