import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

import NavBar from "../navBar";
import EditProfileModal from "./editProfileModal";
import { getCSRFToken } from "../../getCSRFToken";
import ProfilePosts from "./profilePosts";
import Loader from "../../common/loading";

const CreatorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/profile/creator/`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching creator profile", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!profile) {
          return;
        }
        const access = localStorage.getItem("access");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${profile.user.username}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        if (response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching creator posts", error);
      }
    };

    fetchPosts();
  }, [profile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleModalClose = () => {
    setIsEditing(false);
  };

  const handleSave = async (updatedProfile) => {
    try {
      const data = new FormData();
      data.append("user[name]", updatedProfile.user.name);
      data.append("user[email]", updatedProfile.user.email);
      data.append("user[username]", updatedProfile.user.username);
      if (updatedProfile.user.profile_photo instanceof File) {
        data.append("user[profile_photo]", updatedProfile.user.profile_photo);
      }

      if (updatedProfile.user.password) {
        data.append("user[password]", updatedProfile.user.password);
      }

      data.append("user[bio]", updatedProfile.user.bio);
      data.append("date_of_birth", updatedProfile.date_of_birth);
      data.append("area", updatedProfile.area);

      console.log(data);

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/profile/creator/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": getCSRFToken(),
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        console.log(response.data);
        setProfile(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating creator profile", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={posts} />;
      case "instagram":
        return (
          <div>
            <button className="button-54">Connect Instagram</button>
          </div>
        );
      case "tiktok":
        return (
          <div>
            <button className="button-54">Connect Tiktok</button>
          </div>
        );
      case "youtube":
        return (
          <div>
            <button className="button-54">Connect Youtube</button>
          </div>
        );
      default:
        return <button>Connect Instragrm</button>;
    }
  };

  if (!profile) {
    return <Loader />;
  }

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

  const AREA_OPTIONS_OBJECT = AREA_OPTIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return (
    <div className="profile">
      <NavBar />
      <div className="profile-container">
        <div className="profile-left">
          <img
            className="profile-photo"
            src={`${process.env.REACT_APP_API_BASE_URL}${profile.user.profile_photo}`}
            alt="Profile"
          />
          <div className="profile-details">
            <p>
              <span className="detail-label">
                {profile.user.name} |{" "}
                <span className="detail-label">@{profile.user.username}</span>
              </span>
            </p>
            <p>{profile.user.bio}</p>
            <p
              style={{
                backgroundColor: "#CAF0F8",
                padding: "5px 10px",
                borderRadius: "20px",
              }}
            >
              {profile.area
                ? AREA_OPTIONS_OBJECT[profile.area]
                : AREA_OPTIONS_OBJECT[profile.target_audience]}
            </p>
          </div>
          <button className="button-54" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
        <div className="profile-main">
          <div className="profile-reach">
            <div>
              <h1>{profile.user.followers_count}</h1>
              <h1>Followers</h1>
            </div>
            <div>
              <h1>{profile.user.following_count}</h1>
              <h1>Following</h1>
            </div>
            <div>
              <h1>{posts.length}</h1>
              <h1>Posts</h1>
            </div>
          </div>
          <div className="profile-bottom">
            <div className="social-buttons">
              <button
                className="button-54"
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className="button-54"
                onClick={() => setActiveTab("instagram")}
              >
                <span>
                  <FontAwesomeIcon icon={faInstagram} />
                </span>{" "}
                Instagram
              </button>
              <button
                className="button-54"
                onClick={() => setActiveTab("tiktok")}
              >
                <span>
                  <FontAwesomeIcon icon={faTiktok} />
                </span>{" "}
                Tiktok
              </button>
              <button
                className="button-54"
                onClick={() => setActiveTab("youtube")}
              >
                <span>
                  <FontAwesomeIcon icon={faYoutube} />
                </span>{" "}
                Youtube
              </button>
            </div>
            <div className="social-detail">{renderContent()}</div>
          </div>
        </div>
      </div>
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CreatorProfile;
