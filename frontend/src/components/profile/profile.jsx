import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollabs, fetchPosts } from "../../slices/profileSlice";
import NavBar from "../navBar";
import EditProfileModal from "./editProfileModal";
import ProfilePosts from "./profilePosts";
import Loader from "../../common/loading";
import Instagram from "./instagram";
import Youtube from "./youtube";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();

  const { user, type } = useSelector((state) => state.auth);
  const { posts, collabs, profileLoading, profileError } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    dispatch(fetchPosts());
    type === "business" && dispatch(fetchCollabs());
  }, [user, dispatch]);

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={posts} />;
      case "instagram":
        return <Instagram />;
      case "youtube":
        return <Youtube />;
      case "collabs":
        return <ProfilePosts posts={collabs} />;
      default:
        return <ProfilePosts posts={posts} />;
    }
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

  const AREA_OPTIONS_OBJECT = AREA_OPTIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return (
    <div className="profile" style={{backgroundColor: "#f5faff"}}>
      <NavBar />
      {profileLoading && <Loader />}
      <div className="profile-container">
        <div className="profile-left">
          <img
            className="profile-photo"
            src={`${process.env.REACT_APP_API_BASE_URL}${user?.user.profile_photo}`}
            alt="Profile"
          />
          <div className="profile-details">
            <p>
              <span className="detail-label">
                {user?.user.name} |{" "}
                <span className="detail-label">@{user?.user.username}</span>
              </span>
            </p>
            <p>{user?.user.bio}</p>
            <p
              style={{
                backgroundColor: "#CAF0F8",
                padding: "5px 10px",
                borderRadius: "20px",
              }}
            >
              {type === "creator"
                ? AREA_OPTIONS_OBJECT[user?.area]
                : AREA_OPTIONS_OBJECT[user?.target_audience]}
            </p>
          </div>
          <button className="button-54" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>

        <div className="profile-main">
          <div className="profile-reach">
            <div>
              <h1>{user?.user.followers_count}</h1>
              <h1>Followers</h1>
            </div>
            <div>
              <h1>{user?.user.following_count}</h1>
              <h1>Following</h1>
            </div>
            <div>
              <h1>{posts.length}</h1>
              <h1>Posts</h1>
            </div>
            {type === "business" && (
              <div>
                <h1>{collabs.length}</h1>
                <h1>Collabs</h1>
              </div>
            )}
          </div>

          <div className="profile-bottom">
            <div className="social-buttons">
              <button
                className="button-54"
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              {type === "creator" && (
                <button
                  className="button-54"
                  onClick={() => setActiveTab("instagram")}
                >
                  <span>
                    <FontAwesomeIcon icon={faInstagram} />
                  </span>{" "}
                  Instagram
                </button>
              )}

              {type === "creator" && (
                <button
                  className="button-54"
                  onClick={() => setActiveTab("youtube")}
                >
                  <span>
                    <FontAwesomeIcon icon={faYoutube} />
                  </span>{" "}
                  Youtube
                </button>
              )}

              {type === "business" && (
                <button
                className="button-54"
                onClick={() => setActiveTab("collabs")}
              >
                Collabs
              </button>
              )}
            </div>
            <div className="social-detail">{renderContent()}</div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          profile={user}
          type={type}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Profile;
