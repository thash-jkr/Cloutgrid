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
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../../slices/notificationSlice";

const LeftColumn = () => {
  const [showAll, setShowAll] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const dispatch = useDispatch();

  const { user, type } = useSelector((state) => state.auth);
  const { notifications, count } = useSelector((state) => state.notif);

  useEffect(() => {
    dispatch(fetchNotifications(showAll));
  }, [showAll]);

  const handleClose = (id) => {
    dispatch(markAsRead(id));
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
        <h3>{user?.user.name}</h3>
        <img
          className="home-profile-photo"
          src={
            user
              ? `${process.env.REACT_APP_API_BASE_URL}${user?.user.profile_photo}`
              : defaultProfilePhoto
          }
          alt="Profile"
        />
        <div className="left-details">
          {/* <p>
            <span>
              <FontAwesomeIcon
                icon={type === "business" ? faCakeCandles : faGlobe}
              />
            </span>{" - "}
            {userData.date_of_birth ? userData.date_of_birth : userData.website}
          </p> */}
          <p>
            <span>
              <FontAwesomeIcon icon={faBriefcase} />
            </span>
            {" - "}
            {type === "creator"
              ? AREA_OPTIONS_OBJECT[user.area]
              : AREA_OPTIONS_OBJECT[user.target_audience]}
          </p>
        </div>
      </div>

      <div
        className="home-card card-2 notification-card"
        onMouseEnter={() => setDropDownOpen(true)}
        onMouseLeave={() => {
          setTimeout(() => {
            setDropDownOpen(false);
          }, 1000);
        }}
      >
        <h1>
          Notifications{" "}
          <span>
            <FontAwesomeIcon icon={faBell} />
          </span>
          {" - "}
          <span>{count}</span>
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
