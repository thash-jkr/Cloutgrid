import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginBusiness = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.1.106:8000/login/business/",
        {
          email,
          password,
        }
      );
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-form-main">
      <h1>Business Login</h1>
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
        <p>Don't have an account?</p>
        <Link to={"/register"}>Register</Link>
      </div>
    </div>
  );
};

export default LoginBusiness;
