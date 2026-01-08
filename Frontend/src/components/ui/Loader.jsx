export default function Loader({ text = "Loading..." }) {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div
        style={{
          width: 32,
          height: 32,
          margin: "auto",
          border: "4px solid #ddd",
          borderTop: "4px solid black",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
      />
      <p style={{ marginTop: 8, color: "#666" }}>{text}</p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
