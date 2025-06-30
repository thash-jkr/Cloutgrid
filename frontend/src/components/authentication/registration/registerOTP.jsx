import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../navBar";

const OTP = ({ nextStep, formData, prevStep }) => {
  const [OTP, setOTP] = useState("");

  const handleOTP = async () => {
    try {
      nextStep();
    } catch (error) {
      alert("Something went wrong!!!");
    }
  };

  return (
    <div className="container h-dvh mx-auto flex justify-center items-center">
      <NavBar />
      <div className="animate__animated animate__flipInY auth-card">
        <h1 className="font-bold text-4xl mb-10">Email Verification</h1>
        <h4 className="text-">Enter the OTP send to your email!</h4>
        <div className="form-input">
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
  );
};

export default OTP;
