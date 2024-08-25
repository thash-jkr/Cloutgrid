import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../navBar";

const Profiles = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get("http://192.168.1.106:8000/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLoggedInUsername(response.data.user.username);
      } catch (err) {
        setError("Could not fetch logged-in user information");
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (username === loggedInUsername) {
          navigate("/profile");
        }
        const response = await axios.get(
          "http://192.168.1.106:8000/profiles/" + username,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response) {
          setProfileData(response.data);
        }
        const isFollowingResponse = await axios.get(
          `http://192.168.1.106:8000/profiles/${username}/is_following/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsFollowing(isFollowingResponse.data.is_following);
      } catch (err) {
        setError("Profile not found");
      }
    };

    fetchProfile();
  }, [username, loggedInUsername, navigate]);

  const handleFollow = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      await axios.post(
        `http://192.168.1.106:8000/profiles/${username}/follow/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsFollowing(true);
    } catch (err) {
      console.error("Error following user", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      await axios.post(
        `http://192.168.1.106:8000/profiles/${username}/unfollow/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsFollowing(false);
    } catch (err) {
      console.error("Error unfollowing user", err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
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

  const { user, date_of_birth, area } = profileData;

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-left">
          <img
            className="profile-photo"
            src={`http://192.168.1.106:8000${user.profile_photo}`}
            alt="Profile"
          />
          <div className="profile-details">
            <h1>
              <span className="detail-label">{user.name}</span>
            </h1>
            <p>
              <span className="detail-label">@{user.username}</span>
            </p>
            {isFollowing ? (
              <button onClick={handleUnfollow} className="button-54">Unfollow</button>
            ) : (
              <button onClick={handleFollow} className="button-54">Follow</button>
            )}
          </div>
          <div className="profile-categories">
            <h1>Categories</h1>
            {AREA_OPTIONS_OBJECT[area]}
          </div>
          <div className="profile-social">
            <h1>Social Media</h1>
          </div>
        </div>
        <div className="profile-main">
          <div className="profile-reach">
            <div>
              <h1>{user.followers_count}</h1>
              <h1>Followers</h1>
            </div>
            <div>
              <h1>{user.following_count}</h1>
              <h1>Following</h1>
            </div>
            <div>
              <h1>0</h1>
              <h1>Posts</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
