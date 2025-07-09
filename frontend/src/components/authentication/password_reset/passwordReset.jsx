import React, { useState } from "react";
import axios from "axios";
import "animate.css";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../../../common/navBar";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handlePasswordResetRequest } from "../../../slices/authSlice";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(handlePasswordResetRequest(email))
      .unwrap()
      .then(() => {
        toast.success(
          "A Link to reset your Password has been sent to your email"
        );
        setEmail("");
      })
      .catch((error) => toast.error(`Error: ${error}`));
  };

  return (
    <div className="container h-dvh mx-auto flex justify-center items-center">
      <NavBar />
      <Toaster />
      <div className="animate__animated animate__flipInY auth-card w-full">
        <div className="center-vertical w-full">
          <h1 className="font-bold text-2xl mb-10">Reset Password</h1>

          <form onSubmit={handleSubmit} className="center-vertical w-full">
            <div className="form-input w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mt-5">
              <button type="submit" className="button-54">
                Send Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
