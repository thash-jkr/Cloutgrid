import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/hand-drawn-flat-design-bloggers.png";

const BusinessUserRegisterForm = () => {
  const [formData, setFormData] = useState({
    user: {
      name: "",
      email: "",
      username: "",
      profile_photo: null,
      password: "",
      bio: "",
    },
    website: "",
    target_audience: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "website" || name === "target_audience") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [name]: value },
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      user: { ...prevState.user, profile_photo: e.target.files[0] },
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData.user) {
      data.append(`user.${key}`, formData.user[key]);
    }
    data.append("website", formData.website);
    data.append("target_audience", formData.target_audience);

    try {
      const response = await axios.post(
        "http://192.168.1.106:8000/register/business/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select Target Audience" },
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
        <h1>Register Business</h1>
        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="reg-form-container">
            <div className="reg-left">
              <div className="inputbox">
                <input
                  type="text"
                  name="name"
                  value={formData.user.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </div>
              <div className="inputbox">
                <input
                  type="email"
                  name="email"
                  value={formData.user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="inputbox">
                <input
                  type="text"
                  name="username"
                  value={formData.user.username}
                  placeholder="Username"
                  onChange={handleChange}
                />
              </div>
              <div className="inputbox">
                <input
                  type="password"
                  name="password"
                  value={formData.user.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="inputbox">
                <input
                  type="file"
                  name="profile_photo"
                  onChange={handleFileChange}
                  placeholder="Profile Photo"
                  required
                />
              </div>
            </div>

            <div className="reg-right">
              <div className="inputbox">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Website"
                  required
                />
              </div>
              <div className="inputbox">
                <input
                  type="text"
                  name="bio"
                  value={formData.user.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  required
                />
              </div>
              <div className="inputbox">
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
            </div>
          </div>

          <button className="auth-button button-54" type="submit">
            Register
          </button>
        </form>
      </div>
      <div className="reg-img-comp-container">
        <img className="reg-comp-img" src={img} alt="reg-image" />
      </div>
    </div>
  );
};

export default BusinessUserRegisterForm;
