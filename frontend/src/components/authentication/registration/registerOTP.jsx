import React, { useState } from "react";
import { Link } from "react-router-dom";

const OTP = ({ nextStep, formData, prevStep }) => {
  const [OTP, setOTP] = useState(0);

  const handleOTP = async () => {
    try {
      nextStep();
    } catch (error) {
      alert("Something went wrong!!!");
    }
  };

  return (
    <div className="reg-comp-main">
      <div className="reg-comp-body">
        <Link to={"/"}>
          <div className="reg-logo logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>
        <h1>OTP Verification</h1>
        <h4>Enter the OTP send to your email!</h4>
        <div className="inputbox">
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
