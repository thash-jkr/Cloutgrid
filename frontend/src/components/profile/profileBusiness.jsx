import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../navBar";

const CreatorProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/profile/business/`,
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching creator profile", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
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

  const { user, website, target_audience } = profile;

  return (
    <div className="profile">
      <NavBar />
      <div className="profile-container">
        <div className="profile-left">
          <img
            className="profile-photo"
            src={`${process.env.REACT_APP_API_BASE_URL}${user.profile_photo}`}
            alt="Profile"
          />
          <div className="profile-details">
            <p>
              <span className="detail-label">{user.name}</span>
            </p>
            <p>
              <span className="detail-label">@{user.username}</span>
            </p>
            <p>
              <span className="detail-label">{website}</span>
            </p>
          </div>
          <div className="profile-categories">
            <h1>Categories</h1>
            {AREA_OPTIONS_OBJECT[target_audience]}
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

export default CreatorProfile;
