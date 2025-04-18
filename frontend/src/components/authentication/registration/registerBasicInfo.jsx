import React, { useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";

const BasicInfo = ({ nextStep, formData, handleChange, type }) => {
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleContinue = async () => {
    if (formData.user.password !== confirmPassword) {
      alert("Passwords does not match");
      return;
    } else if (
      !formData.user.name ||
      !formData.user.username ||
      !formData.user.email ||
      !formData.user.password
    ) {
      alert("Please complete all the fields");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.user.name);
      data.append("username", formData.user.username);
      data.append("email", formData.user.email);

      // const response = await axios.post(
      //   `${process.env.REACT_APP_API_BASE_URL}/otp/send/`,
      //   data,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // if (response.status === 203) {
      //   alert(response.data.message);
      // }

      // if (response.status === 200) {
      //   nextStep();
      // }
      nextStep();
    } catch (error) {
      console.log(error, "Error at registerBasicInfo");
      alert(error);
    }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="reg-comp-main">
      <div className="reg-comp-body">
        <Link to={"/"}>
          <div className="reg-logo logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>
        <h1>Join as a {type === "creator" ? "Creator" : "Business"}</h1>
        <form className="reg-form" onSubmit={handleContinue}>
          <div className="reg-form-container">
            <div className="form-input">
              <input
                type="text"
                name="name"
                value={formData.user.name}
                onChange={handleChange}
                placeholder="Name:"
                required
              />
            </div>
            <div className="form-input">
              <input
                type="text"
                name="username"
                value={formData.user.username}
                onChange={handleChange}
                placeholder="Username:"
                required
              />
            </div>
            <div className="form-input">
              <input
                type="email"
                name="email"
                value={formData.user.email}
                onChange={handleChange}
                placeholder="Email:"
                required
              />
            </div>
            <div className="form-input">
              <input
                type="password"
                name="password"
                value={formData.user.password}
                onChange={handleChange}
                placeholder="Password:"
                required
              />
            </div>
            <div className="form-input">
              <input
                type="password"
                name="confirm_password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                placeholder="Confirm Password:"
                required
              />
            </div>
          </div>

          <button className="auth-button button-54" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default BasicInfo;
