import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/password-reset-confirm/${uid}/${token}/`,
        {
          password,
        }
      );

      if (response.status === 200) {
        alert("Password has been reset successfully. You can now login");
      }

      navigate("/login");
    } catch (error) {
      alert(error, "An error occurred, please try again");
    }
  };

  return (
    <div className="password-reset-container">
      <Link to={"/"}>
        <div className="reg-logo logo">
          CLOUT<span className="logo-side">Grid</span>
        </div>
      </Link>
      <h1>Enter New Password</h1>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="form-input"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            style={{
              marginBottom: "20px",
            }}
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            style={{
              marginBottom: "20px",
            }}
            required
          />
          <button type="submit" className="button-54">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
