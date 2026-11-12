import "./Loader.css";
import { MorphingInfinity } from "../morphing-infinity.jsx";

export function LoadingMark({ size = 20, className = "" }) {
  const dimensions = size ? { width: size * 2, height: size } : undefined;

  return (
    <MorphingInfinity
      className={`intervyo-loading-mark ${className}`.trim()}
      width={dimensions?.width}
      height={dimensions?.height}
      role="presentation"
      aria-hidden="true"
    />
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
