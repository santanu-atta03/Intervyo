import { useMemo } from "react";

const DynamicSparkline = ({ value = 0, history = [] }) => {

    const { linePath, areaPath } = useMemo(() => {

        // Use actual historical data when available.
        // Otherwise, generate a visual curve based on the current count.
        const data = history.length >= 2
            ? history
            : Array.from({ length: 12 }, (_, i) => {
                const progress = (i + 1) / 12;
                const variation = Math.sin(i * 1.5) * 0.025;

                return Math.max(
                    0,
                    value * (progress + variation)
                );
            });

        const max = Math.max(...data, 1);
        const min = Math.min(...data, 0);

        const range = max - min || 1;

        const points = data.map((item, index) => ({
            x: (index / (data.length - 1)) * 100,
            y: 35 - ((item - min) / range) * 29
        }));

        const line = points
            .map((point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
            )
            .join(" ");

        const area = `${line} L 100 40 L 0 40 Z`;

        return {
            linePath: line,
            areaPath: area
        };

    }, [value, history]);

    const interviewHistory = liveMetrics.interviewHistory || [];

    const graphData = interviewHistory.length > 1
        ? interviewHistory
        : Array.from({ length: 12 }, (_, i) =>
            liveMetrics.interviews * ((i + 1) / 12)
        );

    const maxValue = Math.max(...graphData, 1);

    const points = graphData.map((value, index) => ({
        x: (index / (graphData.length - 1)) * 100,
        y: 35 - (value / maxValue) * 29
    }));

    const sparklineLinePath = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    const sparklineAreaPath =
        `${sparklineLinePath} L 100 40 L 0 40 Z`;
    return (
        <svg
            className="absolute translate-x-[120px] translate-y-[50px] w-[260px] h-[60px] shrink-0 overflow-visible"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            fill="none"
        >
            <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E879F9" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#E879F9" stopOpacity="0" />
                </linearGradient>
            </defs>

            <path
                d={sparklineAreaPath}
                fill="url(#perfGrad)"
            />

            <path
                d={sparklineLinePath}
                stroke="#E879F9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
};

export default DynamicSparkline;