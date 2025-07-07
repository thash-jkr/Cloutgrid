import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "animate.css";

import { useDispatch } from "react-redux";
import { loginThunk } from "../../slices/authSlice";
import toast, { Toaster } from "react-hot-toast";

const LoginBusiness = ({ setType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loading = toast.loading("Logging in...");

    dispatch(loginThunk({ email, password, type: "business" }))
      .unwrap()
      .then(() => {
        toast.success("Login successful!", { id: loading });
        navigate("/", { replace: true });
      })
      .catch((error) => toast.error(`Login Failed: ${error}`, { id: loading }));
  };

  return (
    <div className="animate__animated animate__flipInY auth-card">
      <Toaster />
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="font-bold text-4xl mb-10">Business Login</h1>

        <form
          className="flex flex-col justify-center items-center w-full"
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
            <button className="button-54" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col justify-center items-center mt-10 text-sm font-bold">
        <div className="text-orange-500 hover:text-red-500 font-extrabold mb-2">
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </div>
        <div className="mb-2">
          <p>
            Not a business?{" "}
            <span
              className="text-orange-500 hover:text-red-500 font-extrabold cursor-pointer"
              onClick={() => setType("creator")}
            >
              Creator Login
            </span>
          </p>
        </div>
        <div className="flex justify-center items-center">
          <p>Don't have an account?</p>
          <Link
            className="text-orange-500 hover:text-red-500 font-extrabold ml-1"
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
