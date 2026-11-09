import { LoadingMark } from "../Loader/Loader";

export default function LoadingButton({ loading, children, ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      style={{
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <LoadingMark size={10} />
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
