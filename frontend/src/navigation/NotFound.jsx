import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../common/navBar";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto w-lvw h-lvh center-vertical">
      <NavBar />
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.5rem", margin: "1rem 0" }}>
        Oops! We can’t find the page you’re looking for.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate(-1)} className="button-54">
          Go Back
        </button>
        <button className="button-54" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
