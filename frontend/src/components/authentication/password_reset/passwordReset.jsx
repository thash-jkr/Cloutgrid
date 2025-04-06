import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/password-reset/`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Password reset link sent to your email");
      }

      navigate("/");
    } catch (error) {
      alert("An error occurred, please try again");
    }
  };

  return (
    <div className="password-reset-container">
      <Link to={"/"}>
        <div className="reg-logo logo">
          CLOUT<span className="logo-side">Grid</span>
        </div>
      </Link>
      <h1>Reset Password</h1>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="form-input"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              marginBottom: "20px",
            }}
            required
          />
          <button type="submit" className="button-54">
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
