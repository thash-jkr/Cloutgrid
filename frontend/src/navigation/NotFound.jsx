import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        padding: "2rem",
        color: "#333",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.5rem", margin: "1rem 0" }}>
        Oops! We can’t find the page you’re looking for.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "0.5rem 1.5rem",
            fontSize: "1rem",
            background: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
        <Link
          to="/"
          style={{
            padding: "0.5rem 1.5rem",
            fontSize: "1rem",
            background: "#6c757d",
            color: "#fff",
            textDecoration: "none",
            border: "none",
            borderRadius: "4px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
