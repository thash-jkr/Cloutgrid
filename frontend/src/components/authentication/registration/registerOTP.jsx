import React, { useState } from "react";
import NavBar from "../../../common/navBar";
import toast, { Toaster } from "react-hot-toast";

const OTP = ({ nextStep, formData, prevStep }) => {
  const [OTP, setOTP] = useState("");

  const handleOTP = async () => {
    try {
      nextStep();
    } catch (error) {
      toast.error("Something went wrong!!!");
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(155deg,rgba(255, 255, 255, 1) 0%,rgba(202, 240, 248, 1) 100%",
      }}
    >
      <div className="container h-dvh mx-auto flex justify-center items-center">
        <NavBar />
        <div className="animate__animated animate__flipInY auth-card">
          <Toaster />
          <h1 className="font-bold text-2xl mb-10">Email Verification</h1>
          <h4 className="text-lg">Enter the OTP send to your email!</h4>
          <div className="form-input w-full">
            <input
              type="text"
              name="otp"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter OTP here..."
              required
            />
          </div>
          <div>
            <button className="auth-button button-54" onClick={prevStep}>
              Go Back
            </button>{" "}
            <button className="auth-button button-54" onClick={handleOTP}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
