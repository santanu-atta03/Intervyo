export default function LoadingButton({ loading, children, ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      style={{
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer"
      }}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
