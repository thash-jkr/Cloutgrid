import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../navBar";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { registerThunk } from "../../../slices/authSlice";

const MoreInfo = ({ formData, handleChange, type }) => {
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.user?.password !== confirmPassword) {
      toast.error("Passwords Must Match!");
      return;
    }

    const data = new FormData();

    for (const key in formData.user) {
      data.append(`user.${key}`, formData.user[key]);
    }

    if (type === "creator") {
      data.append("area", formData.area);
    } else {
      data.append("target_audience", formData.target_audience);
    }

    dispatch(registerThunk({ data, type }))
      .unwrap()
      .then(() => {
        toast.success("Registration Successful");
        navigate("/login", { replace: true });
      })
      .catch((error) => toast.error(`Error: ${error}`));
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select Category" },
    { value: "art", label: "Art and Photography" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty and Makeup" },
    { value: "business", label: "Business" },
    { value: "diversity", label: "Diversity and Inclusion" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "fashion", label: "Fashion" },
    { value: "finance", label: "Finance" },
    { value: "food", label: "Food and Beverage" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health and Wellness" },
    { value: "home", label: "Home and Gardening" },
    { value: "outdoor", label: "Outdoor and Nature" },
    { value: "parenting", label: "Parenting and Family" },
    { value: "pets", label: "Pets" },
    { value: "sports", label: "Sports and Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "videography", label: "Videography" },
  ];

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
          <h1 className="font-bold text-2xl mb-10">Additional Information</h1>

          <form className="center-vertical w-[90%]" onSubmit={handleSubmit}>
            <div className="form-input w-full">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a strong password:"
                required
              />
            </div>

            <div className="form-input w-full">
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                s
                required
              />
            </div>

            {type === "creator" ? (
              <div className="form-input w-full">
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="font-bold"
                  required
                >
                  {AREA_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-input w-full">
                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  required
                >
                  {AREA_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-5">
              <button
                className="button-54"
                type="submit"
                disabled={authLoading}
              >
                {authLoading ? "Loading" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MoreInfo;
