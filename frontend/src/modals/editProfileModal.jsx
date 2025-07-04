import { faClose, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const EditProfileModal = ({ profile, onClose }) => {
  const { type } = useSelector((state) => state.auth);

  let initialState;

  if (type === "creator") {
    initialState = {
      user: {
        name: profile.user.name,
        username: profile.user.username,
        email: profile.user.email,
        bio: profile.user.bio,
        profile_photo: profile.user.profile_photo,
      },
      area: profile.area,
    };
  } else {
    initialState = {
      user: {
        name: profile.user.name,
        username: profile.user.username,
        email: profile.user.email,
        bio: profile.user.bio,
        profile_photo: profile.user.profile_photo,
      },
      website: profile.website,
      target_audience: profile.target_audience,
    };
  }

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    console.log(formData);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.user) {
      setFormData({
        ...formData,
        user: { ...formData.user, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      user: { ...formData.user, profile_photo: e.target.files[0] },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const AREA_OPTIONS = [
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
    <div className="modal-background">
      <Toaster />
      <div className="modal-container">
        <div className="modal-header">
          <h1>Edit Profile</h1>
          <button className="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body overflow-y-scroll">
          <div className="w-full center-vertical my-3 group cursor-pointer">
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${formData.user.profile_photo}`}
              alt="Profile Photo"
              className="w-1/4 rounded-full group-hover:scale-105 transition-transform"
            />
            <span className="group-hover:bg-white group-hover:-translate-y-8 transition-all w-7 h-7 center rounded-full">
              <FontAwesomeIcon icon={faEdit} className="" />
            </span>
          </div>

          <div className="form-input center-left w-full">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.user.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-input center-left w-full">
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData.user.bio}
              onChange={handleChange}
            />
          </div>

          {type === "business" && (
            <div className="form-input center-left w-full">
              <label>Website:</label>
              <input
              type="url"
              name="website"
              value={formData.user.name}
              onChange={handleChange}
            />
            </div>
          )}

          <div className="form-input center-left w-full font-bold">
            <label>Creator Category:</label>
            <select name="area" value={formData.area} onChange={handleChange}>
              {AREA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="center py-2">
          <button className="button-54" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
