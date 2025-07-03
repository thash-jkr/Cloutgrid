import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import NavBar from "../../navBar";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handlePasswordResetConfirm } from "../../../slices/authSlice";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(
      handlePasswordResetConfirm({
        uid,
        token,
        password,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          "Password has been reset successfully. You can now login"
        );
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="container h-dvh mx-auto flex justify-center items-center">
      <NavBar />
      <div className="animate__animated animate__flipInY auth-card">
        <Toaster />
        <div className="center-vertical">
          <h1 className="font-bold text-2xl mb-10">Enter New Password</h1>

          <form onSubmit={handleSubmit} className="center-vertical">
            <div className="form-input">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="form-input">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="mt-5">
              <button type="submit" className="button-54">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
