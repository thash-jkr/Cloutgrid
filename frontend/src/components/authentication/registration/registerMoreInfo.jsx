import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MoreInfo = ({ formData, setFormData, handleChange, type }) => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("No file detected!")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData.user) {
      data.append(`user.${key}`, formData.user[key]);
    }

    if (type === "creator") {
      data.append("date_of_birth", formData.date_of_birth);
      data.append("area", formData.area);
    } else {
      data.append("website", formData.website);
      data.append("target_audience", formData.target_audience);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/register/${type}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Registration Successful");
        navigate("/login");
      }
    } catch (error) {
      console.log(error, "Error creating user!");
      alert("Something went wrong...!");
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      user: { ...prevState.user, profile_photo: e.target.files[0] },
    }));
    setFileName(e.target.files[0].name)
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select Area" },
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
    <div className="reg-comp-main">
      <div className="reg-comp-body">
        <Link to={"/"}>
          <div className="reg-logo logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>
        <h1>Additional Information</h1>
        <form className="reg-form">
          <div className="reg-form-container">
            <div className="reg-secondary">
              <div className="form-input input-secondary">
                <label htmlFor="profile_photo" className="button-54 button-file">
                  Add a Profile Photo
                </label>
                <input
                  type="file"
                  id="profile_photo"
                  name="profile_photo"
                  onChange={handleFileChange}
                  placeholder="Profile Photo"
                />
                <span>{fileName}</span>
              </div>

              {type === "creator" ? (
                <div className="form-input input-secondary">
                  <label htmlFor="date_of_birth">
                    Enter your Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    placeholder="Date of Birth"
                    required
                  />
                </div>
              ) : (
                <div className="form-input input-secondary">
                  <label>Enter your Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website"
                    required
                  />
                </div>
              )}

              {type === "creator" ? (
                <div className="form-input input-secondary">
                  <label htmlFor="area">Select your Creator Category</label>
                  <select
                    name="area"
                    value={formData.area}
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
              ) : (
                <div className="form-input input-secondary">
                  <label htmlFor="target_audience">
                    Select your Business Category
                  </label>
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
            </div>
          </div>

          <button className="auth-button button-54" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MoreInfo;
