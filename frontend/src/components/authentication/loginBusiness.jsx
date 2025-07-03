import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "animate.css";

import Loader from "../../common/loading";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../slices/authSlice";
import toast, { Toaster } from "react-hot-toast";

const LoginBusiness = ({ setType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password, type: "business" }))
      .unwrap()
      .then(() => navigate("/", { replace: true }))
      .catch((error) => toast.error(`Login Failed: ${error}`));
  };

  return (
    <div className="animate__animated animate__flipInY auth-card">
      <Toaster />
      {isLoading && <Loader />}
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="font-bold text-4xl mb-10">Business Login</h1>

        <form
          className="flex flex-col justify-center items-center w-[90%]"
          onSubmit={handleSubmit}
        >
          <div className="form-input w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-input w-full">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mt-5">
            <button className="button-54" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
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
            Not a business?{" "}
            <span
              className="text-blue-500 hover:text-red-500 font-extrabold cursor-pointer"
              onClick={() => setType("creator")}
            >
              Creator Login
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

export default LoginBusiness;
