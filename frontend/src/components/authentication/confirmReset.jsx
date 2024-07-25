import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://192.168.1.106:8000/accounts/password/reset/confirm/`, {
        uid,
        token,
        new_password1: newPassword,
        new_password2: newPassword,
      });
      setMessage("Password has been reset successfully");
    } catch (error) {
      setMessage("An error occurred, please try again");
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Enter New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordResetConfirm;
