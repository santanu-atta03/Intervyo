import "./Loader.css";

const CIRCLE_PATH =
  "M 75 50 C 75 22.386 86.193 0 100 0 C 113.807 0 125 22.386 125 50 C 125 77.614 113.807 100 100 100 C 86.193 100 75 77.614 75 50";
const INFINITY_PATH =
  "M 20 50 C 40 12 70 12 100 50 C 130 88 160 88 180 50 C 160 12 130 12 100 50 C 70 88 40 88 20 50";

export function LoadingMark({ size = 20, className = "" }) {
  const dimensions = size ? { width: size * 2, height: size } : undefined;

  return (
    <svg
      className={`intervyo-loading-mark ${className}`.trim()}
      viewBox="0 0 200 100"
      width={dimensions?.width}
      height={dimensions?.height}
      role="presentation"
      aria-hidden="true"
    >
      <path
        d={CIRCLE_PATH}
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="d"
          values={`${CIRCLE_PATH};${INFINITY_PATH};${INFINITY_PATH};${CIRCLE_PATH};${CIRCLE_PATH}`}
          keyTimes="0;0.24;0.58;0.82;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
          dur="4.8s"
          calcMode="spline"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dasharray"
          values="0.14 0.86;1 0;1 0;0.14 0.86;0.14 0.86"
          keyTimes="0;0.24;0.58;0.82;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
          dur="4.8s"
          calcMode="spline"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 100 50;360 100 50;360 100 50;720 100 50;720 100 50"
          keyTimes="0;0.24;0.58;0.82;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
          dur="4.8s"
          calcMode="spline"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export function IntervyoLoader({ label = "Loading" }) {
  return (
    <div className="intervyo-loader" role="status" aria-label={label}>
      <LoadingMark size={0} className="intervyo-loading-mark--hero" />
    </div>
  );
}

export function DashboardLoader() {
  return <IntervyoLoader label="Loading dashboard" />;
}

export function InterviewRoomLoader() {
  return <IntervyoLoader label="Loading interview room" />;
}

export function ResultsLoader() {
  return <IntervyoLoader label="Loading interview results" />;
}

export function LightningLoader() {
  return <DashboardLoader />;
}

export default IntervyoLoader;
