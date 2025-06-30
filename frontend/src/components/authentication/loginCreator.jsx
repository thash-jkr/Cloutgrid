import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import "animate.css";
import Loader from "../../common/loading";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../slices/authSlice";

const LoginCreator = ({ setType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authLoading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(loginThunk({ email, password, type: "creator" }));
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="animate__animated animate__flipInY auth-card">
      <div className="flex flex-col justify-center items-center">
        {authLoading && <Loader />}
        <h1 className="font-bold text-4xl mb-10">Creator Login</h1>

        <form
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
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

          <div className="mt-5">
            <button className="button-54" type="submit" disabled={authLoading}>
              {authLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col justify-center items-center mt-10 text-sm">
        <div className="text-blue-500 hover:text-red-500 font-extrabold">
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </div>
        <div>
          <p>
            Not a creator?{" "}
            <span
              className="text-blue-500 hover:text-red-500 font-extrabold cursor-pointer"
              onClick={() => setType("business")}
            >
              Business Login
            </span>
          </p>
        </div>
        <div className="flex justify-center items-center">
          <p>Don't have an account?</p>
          <Link
            className="text-blue-500 hover:text-red-500 font-extrabold ml-1"
            to={"/register"}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCreator;
