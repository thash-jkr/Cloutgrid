import {
  faArrowLeft,
  faClose,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../slices/profileSlice";
import ImageUploaderWithCrop from "../common/imageUpload";

const EditProfileModal = ({ profile, onClose }) => {
  const { user, type } = useSelector((state) => state.auth);

  let initialState;

  if (type === "creator") {
    initialState = {
      user: {
        name: profile.user.name,
        username: profile.user.username,
        email: profile.user.email,
        password: "",
        bio: profile.user.bio,
        profile_photo: null,
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
        bio: profile.user.bio,
        profile_photo: null,
      },
      website: profile.website,
      target_audience: profile.target_audience,
    };
  }

  const [formData, setFormData] = useState(initialState);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully");
        setTimeout(() => {
          onClose();
        }, 1000);
      })
      .catch((error) => {
        toast.error(`Error: ${error}`);
      });
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
          <div className="center">
            {showImageUpload && (
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="mr-2"
                onClick={() => setShowImageUpload(false)}
              />
            )}
            <h1>Edit Profile</h1>
          </div>
          <button className="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        {showImageUpload ? (
          <div className="modal-body p-2">
            <ImageUploaderWithCrop
              onImageCropped={(fileObj) => {
                setFormData((prevState) => ({
                  ...prevState,
                  user: { ...formData.user, profile_photo: fileObj.file },
                }));
                setPreview(fileObj.preview);
                setShowImageUpload(false);
              }}
            />
          </div>
        ) : (
          <div className="modal-body overflow-y-scroll">
            <div
              className="w-full center-vertical my-3 group cursor-pointer"
              onClick={() => setShowImageUpload(true)}
            >
              <img
                src={
                  formData.user.profile_photo
                    ? `${preview}`
                    : `${process.env.REACT_APP_API_BASE_URL}${user?.user.profile_photo}`
                }
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
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="form-input center-left w-full font-bold">
              <label>Creator Category:</label>
              <select
                name={type === "creator" ? "area" : "target_audience"}
                value={
                  type === "creator" ? formData.area : formData.target_audience
                }
                onChange={handleChange}
              >
                {AREA_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="center py-2">
          <button
            className="button-54"
            onClick={handleSubmit}
            disabled={showImageUpload}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
