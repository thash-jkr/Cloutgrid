import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      <h2>Enter New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordResetConfirm;
