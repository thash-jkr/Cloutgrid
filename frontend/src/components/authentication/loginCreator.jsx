import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const LoginCreator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login/creator/`,
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-form-main">
      <h1>Creator Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-input">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button className="auth-button button-54" type="submit">
          Login
        </button>
      </form>
      <div className="login-footer">
        <div className="login-reg">
          <p>Don't have an account?</p>
          <Link to={"/register/creator"}>Register</Link>
        </div>
        <div>
          <Link to={"/reset-password"}>Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCreator;
