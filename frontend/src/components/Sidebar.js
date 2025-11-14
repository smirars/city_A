import React from "react";

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div style={{
      width: "80px",
      height: "100vh",
      background: "#f5f5f5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "20px"
    }}>
      <button
        style={{ marginBottom: "20px" }}
        onClick={() => setCurrentPage("home")}
      >
        🏠
      </button>
      <button onClick={() => setCurrentPage("stats")}>📊</button>
      <button
        style={{ marginTop: "20px" }}
        onClick={() => setCurrentPage("create")}
      >
        ✏️
      </button>

      <button
        style={{ marginTop: "20px" }}
        onClick={() => setCurrentPage("feedback")}
      >
        ✉️
      </button>

    </div>
  );
}
