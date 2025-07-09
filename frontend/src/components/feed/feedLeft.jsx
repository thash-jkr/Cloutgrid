import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faBell,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import defaultProfilePhoto from "../../assets/default_profile.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../../slices/notificationSlice";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

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
    <div className="center-vertical w-full mr-5">
      <div className="center-vertical shadow w-full rounded-xl bg-white">
        <h3 className="font-bold text-2xl my-2">{user?.user.name}</h3>
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={
            user
              ? `${process.env.REACT_APP_API_BASE_URL}${user?.user.profile_photo}`
              : defaultProfilePhoto
          }
          alt="Profile"
        />
        <div className="font-bold text-xl center w-full my-2">
          <p
            className="px-3 py-2 bg-orange-500 text-white my-2 mt-1 rounded-full font-extrabold text-sm 
               transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow"
          >
            {type === "creator"
              ? AREA_OPTIONS_OBJECT[user?.area]
              : AREA_OPTIONS_OBJECT[user?.target_audience]}
          </p>
        </div>
      </div>

      <div
        className={`center-vertical shadow w-full rounded-xl mt-5 cursor-pointer group
        relative bg-white`}
      >
        <div
          className="w-full center"
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          <h1 className="font-bold text-xl my-3 center">
            <div className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mr-1">
                Notifications
              </span>
            </div>
            <span>
              <FontAwesomeIcon icon={faBell} />
            </span>
            <div className="bg-orange-500 p-1 h-5 w-5 center rounded-full ml-1">
              <span className={`text-white ${count < 10 ? "text-sm" : "text-xs"} font-bold`}>{count}</span>
            </div>
            <span
              className={`absolute right-3 transition-transform duration-500 ${
                !dropDownOpen &&
                "duration-300 group-hover:scale-125 group-hover:rotate-12"
              } ${dropDownOpen ? "rotate-180" : ""}`}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </h1>
        </div>

        <div
          className={`notification-dropdown ${
            dropDownOpen ? "open border-t" : ""
          }`}
        >
          <div className="flex w-full p-1 max-h-96 overflow-y-scroll noscroll rounded-xl">
            {notifications.length > 0 ? (
              <ul className="divide-y w-full">
                {notifications.map((notification) => (
                  <li key={notification.id} className="w-full">
                    <div className="p-2 flex justify-between items-center hover:bg-slate-50 w-full">
                      <p>{notification.message}</p>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="text-gray-200 hover:text-red-700"
                        onClick={() => handleClose(notification.id)}
                      />
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
