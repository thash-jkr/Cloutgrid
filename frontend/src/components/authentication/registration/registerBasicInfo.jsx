import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../navBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const BasicInfo = ({ nextStep, formData, handleChange, type }) => {
  const handleContinue = async (e) => {
    e.preventDefault()

    if (
      !formData.user.name ||
      !formData.user.username ||
      !formData.user.email
    ) {
      toast.error("Please complete all the fields");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.user.name);
      data.append("username", formData.user.username);
      data.append("email", formData.user.email);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/otp/send/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 203) {
        toast.error(response.data.message);
      }

      if (response.status === 200) {
        nextStep();
      }
    } catch (error) {
      toast.error(error.response?.data.message)
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
          <h1 className="font-bold text-2xl mb-10">
            {type === "creator" ? "Creator" : "Business"} Registration
          </h1>

          <form className="reg-form w-full" onSubmit={handleContinue}>
            <div className="reg-form-container w-full">
              <div className="form-input w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.user.name}
                  onChange={handleChange}
                  placeholder="Name:"
                  required
                />
              </div>

              <div className="form-input w-full">
                <input
                  type="text"
                  name="username"
                  value={formData.user.username}
                  onChange={handleChange}
                  placeholder="Username:"
                  required
                />
              </div>

              <div className="form-input w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.user.email}
                  onChange={handleChange}
                  placeholder="Email:"
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
    </div>
  );
};

export default BasicInfo;
