import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faBriefcase,
  faGlobe,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import defaultProfilePhoto from "../../assets/default_profile.png";
import ShowAll from "../../common/showAll";

const LeftColumn = ({ userData }) => {
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/notifications/?all=${showAll}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [showAll]);

  const handleClose = async (id) => {
    try {
      const accessToken = localStorage.getItem("access");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error closing notification:", error);
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
    <div className="left-container">
      <div className="home-card card-1">
        <h3>{userData.user ? userData.user.name : ""}</h3>
        <img
          className="home-profile-photo"
          src={
            userData.user
              ? `${process.env.REACT_APP_API_BASE_URL}${userData.user.profile_photo}`
              : defaultProfilePhoto
          }
          alt="Profile"
        />
        <div className="left-details">
          <p>
            <span>
              <FontAwesomeIcon
                icon={userData.date_of_birth ? faCakeCandles : faGlobe}
              />
            </span>{" "}
            {userData.date_of_birth ? userData.date_of_birth : userData.website}
          </p>
          <p>
            <span>
              <FontAwesomeIcon icon={faBriefcase} />
            </span>{" "}
            {userData.area
              ? AREA_OPTIONS_OBJECT[userData.area]
              : AREA_OPTIONS_OBJECT[userData.target_audience]}
          </p>
        </div>
      </div>

      <div
        className="home-card card-2 notification-card"
        onMouseEnter={() => setDropDownOpen(true)}
        onMouseLeave={() => setDropDownOpen(false)}
      >
        <h1>
          Notifications{" "}
          <span>
            <FontAwesomeIcon icon={faBell} />
          </span>
        </h1>
        <div className={`notification-dropdown ${dropDownOpen ? "open" : ""}`}>
          <ShowAll showAll={showAll} setShowAll={setShowAll} />
          <div className="notification-main">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <div
                      className="notification-container"
                      onClick={() => handleClose(notification.id)}
                    >
                      <p>{notification.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;
