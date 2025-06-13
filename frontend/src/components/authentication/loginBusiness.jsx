import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "animate.css";

import { getCSRFToken } from "../../getCSRFToken";
import Loader from "../../common/loading";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../slices/authSlice";

const LoginBusiness = ({ setType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      dispatch(loginThunk({ email, password, type: "business" }));
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="login-body animate__animated animate__flipInY">
      <div className="login">
        <div className="login-form-main">
          {isLoading && <Loader />}
          <h1 className="">Business Login</h1>
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
            <button
              className="auth-button button-54"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <div className="reg-footer">
        <div className="reg-footer-text">
          <p>Don't have an account?</p>
          <Link to={"/register"}>Register</Link>
        </div>
        <div>
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </div>
        <div>
          <p>
            Not a business?{" "}
            <span onClick={() => setType("creator")}>Creator Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginBusiness;
