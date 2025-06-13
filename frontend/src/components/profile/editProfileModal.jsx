import React, { useState } from "react";

const EditProfileModal = ({ profile, type, onClose }) => {
  let initialState;

  if (type === "creator") {
    initialState = {
      user: {
        name: profile.user.name,
        username: profile.user.username,
        email: profile.user.email,
        password: "",
        profile_photo: null,
        bio: profile.user.bio,
      },
      area: profile.area,
    };
  } else {
    initialState = {
      user: {
        name: profile.user.name,
        username: profile.user.username,
        email: profile.user.email,
        password: "",
        profile_photo: null,
        bio: profile.user.bio,
      },
      website: profile.website,
      target_audience: profile.target_audience,
    };
  }

  const [formData, setFormData] = useState(initialState);

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
      <div className="modal-container" style={{width: "40vw"}}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <span className="close-modal" onClick={onClose}>
            &times;
          </span>
        </div>

        <form
          encType="multipart/form-data"
          className="reg-form modal-body reg-form-container reg-secondary"
        >
          <div className="form-input input-secondary">
            <label className="input-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.user.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-input input-secondary">
            <label htmlFor="profile_photo" className="button-54 button-file">
              Change Photo
            </label>
            <input
              type="file"
              id="profile_photo"
              name="profle_photo"
              onChange={handleFileChange}
              placeholder="Profile photo"
            />
          </div>

          <div className="form-input input-secondary">
            <label className="input-label">Bio</label>
            <textarea
              name="bio"
              value={formData.user.bio}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-input input-secondary">
            <label className="input-label">Area</label>
            <select name="area" value={formData.area} onChange={handleChange}>
              <option value="">Select Area</option>
              {AREA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="modal-footer">
          <button className="button-54" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
