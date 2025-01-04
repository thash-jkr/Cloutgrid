import React, { useEffect, useState } from "react";
import axios from "axios";

import Loader from "../../common/loading";
import NavBar from "../navBar";
import EditProfileModal from "./editProfileModal";
import ProfilePosts from "./profilePosts";

const CreatorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [collabs, setCollabs] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/profile/business/`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching creator profile", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const access = localStorage.getItem("access");
    const fetchPosts = async () => {
      try {
        if (!profile) {
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${profile.user.username}/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        alert("Error fetching posts!");
      }
    };

    const fetchCollabs = async () => {
      try {
        if (!profile) {
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/collabs/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setCollabs(response.data);
        }
      } catch (error) {
        alert("Cannot fetch collaborations");
      }
    };

    fetchPosts();
    fetchCollabs();
  }, [profile]);

  const handleSave = () => {};

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={posts} />;
      case "collabs":
        return <ProfilePosts posts={collabs} />;
      default:
        return;
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
          <button className="button-54" onClick={() => setIsEditing(true)}>
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
            <div>
              <h1>{collabs.length}</h1>
              <h1>Collabs</h1>
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
                onClick={() => setActiveTab("collabs")}
              >
                Collaborations
              </button>
            </div>
            <div className="social-detail">{renderContent()}</div>
          </div>
        </div>
      </div>
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CreatorProfile;
