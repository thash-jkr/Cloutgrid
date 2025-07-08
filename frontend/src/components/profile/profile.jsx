import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollabs, fetchPosts } from "../../slices/profileSlice";
import NavBar from "../navBar";
import EditProfileModal from "../../modals/editProfileModal";
import ProfilePosts from "./profilePosts";
import Loader from "../../common/loading";
import Instagram from "./instagram";
import Youtube from "./youtube";
import {
  faArrowRightFromBracket,
  faChevronDown,
  faCircleInfo,
  faComments,
  faEdit,
  faFileContract,
  faGear,
  faHandshake,
  faLifeRing,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <div className="container mx-auto flex flex-col lg:flex-row items-start mt-20 lg:mt-28 noselect">
      <NavBar />
      <div className="flex basis-1/4 w-full">
        <div className="center-vertical w-full lg:mr-5 mb-5 lg:mb-0 px-3 lg:px-0">
          <div
            className="center-vertical shadow w-full rounded-xl bg-white font-semibold text-xl 
          xl:text-lg md:text-base"
          >
            <div className="center-vertical w-full py-3 border-b">
              <h1>
                {user?.user.name} | @{user?.user.username}
              </h1>

              <p
                className="px-3 py-2 bg-orange-500 text-white my-2 mt-5 rounded-full font-extrabold text-sm 
               transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow"
              >
                {type === "creator"
                  ? AREA_OPTIONS_OBJECT[user?.area]
                  : AREA_OPTIONS_OBJECT[user?.target_audience]}
              </p>
            </div>

            <div className="flex w-full justify-around items-center p-5 border-b">
              <div className="w-1/2 center-vertical">
                <img
                  className="w-28 h-28 rounded-full object-cover"
                  src={`${process.env.REACT_APP_API_BASE_URL}${user?.user.profile_photo}`}
                  alt="Profile"
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-around items-center">
                <div className="center">
                  <h1 className="mr-2">{user?.user.followers_count}</h1>
                  <h1>Followers</h1>
                </div>
                <div className="center">
                  <h1 className="mr-2">{user?.user.following_count}</h1>
                  <h1>Following</h1>
                </div>
                <div className="center">
                  <h1 className="mr-2">{posts.length}</h1>
                  <h1>Posts</h1>
                </div>
                {type === "business" && (
                  <div className="center">
                    <h1 className="mr-2">{collabs.length}</h1>
                    <h1>Collabs</h1>
                  </div>
                )}
              </div>
            </div>

            <div className="px-1 py-5">
              <p>{user?.user.bio}</p>
            </div>
          </div>

          <div
            className="mt-5 lg:hidden center-vertical shadow w-full rounded-xl cursor-pointer 
          hover:shadow relative group bg-white center"
          >
            <div
              className="w-full center"
              onClick={() => setSettingsDropdown(!settingsDropdown)}
            >
              <div className="font-bold text-xl my-3 center">
                <h1 className="mr-1">Settings</h1>
                <span
                  className={`transition-transform duration-500 ${
                    settingsDropdown ? "rotate-180" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faGear} />
                </span>
                <span
                  className={`absolute right-3 transition-transform duration-500 ${
                    settingsDropdown ? "rotate-180" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
              </div>
            </div>

            <div
              className={`${
                settingsDropdown ? "flex" : "hidden"
              } flex-col w-full divide-y font-semibold text-lg`}
            >
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faLifeRing} />
                <h1 className="ml-1">Help</h1>
              </div>
              <div className="p-3 flex items-center justify-star hover:bg-slate-50">
                <FontAwesomeIcon icon={faCircleInfo} />
                <h1 className="ml-1">About</h1>
              </div>
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faFileContract} />
                <h1 className="ml-1">Privacy Policy</h1>
              </div>
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faHandshake} />
                <h1 className="ml-1">EULA</h1>
              </div>
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faComments} />
                <h1 className="ml-1">Feedback</h1>
              </div>
              <div
                className="p-3 flex items-center justify-start hover:bg-slate-50"
                onClick={() => setShowEditProfileModal(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
                <h1 className="ml-1">Edit Profile</h1>
              </div>
              <div
                className="p-3 flex items-center justify-start hover:bg-slate-50 rounded-b-2xl"
                onClick={() => navigate("/logout")}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <h1 className="ml-1">Logout</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex lg:basis-2/4 w-full">
        <div className="w-full px-3">
          <div className="bg-white p-3 rounded-2xl shadow flex justify-around items-center mb-5 w-full">
            <button className="button-54" onClick={() => setActiveTab("posts")}>
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

          <div
            className="bg-white rounded-2xl shadow mb-5 min-h-[20vh] 
          flex flex-col justify-start w-full items-center overflow-auto"
          >
            {renderContent()}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex basis-1/4 w-full noselect">
        <div className="center-vertical w-full ml-5">
          <div
            className="center-vertical shadow w-full rounded-xl cursor-pointer 
            hover:shadow relative group bg-white center"
          >
            <div
              className="w-full center"
              onClick={() => setSettingsDropdown(!settingsDropdown)}
            >
              <div className="font-bold text-xl my-3 center">
                <div className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mr-1">
                    Settings
                  </span>
                </div>
                <span
                  className={`transition-transform duration-500 ${
                    settingsDropdown ? "rotate-180" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faGear} />
                </span>
                <span
                  className={`absolute right-3 transition-transform duration-500 ${
                    !settingsDropdown &&
                    "duration-300 group-hover:scale-125 group-hover:rotate-12"
                  } ${settingsDropdown ? "rotate-180" : ""}`}
                >
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
              </div>
            </div>

            <div
              className={`${
                settingsDropdown ? "flex" : "hidden"
              } flex-col w-full divide-y font-semibold text-lg`}
            >
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faLifeRing} />
                <h1 className="ml-1">Help</h1>
              </div>
              <div className="p-3 flex items-center justify-star hover:bg-slate-50">
                <FontAwesomeIcon icon={faCircleInfo} />
                <h1 className="ml-1">About</h1>
              </div>
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faFileContract} />
                <h1 className="ml-1">Privacy Policy</h1>
              </div>
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faHandshake} />
                <h1 className="ml-1">EULA</h1>
              </div>
              <div className="p-3 flex items-center justify-start hover:bg-slate-50">
                <FontAwesomeIcon icon={faComments} />
                <h1 className="ml-1">Feedback</h1>
              </div>
              <div
                className="p-3 flex items-center justify-start hover:bg-slate-50"
                onClick={() => setShowEditProfileModal(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
                <h1 className="ml-1">Edit Profile</h1>
              </div>
              <div
                className="p-3 flex items-center justify-start hover:bg-slate-50 rounded-b-2xl"
                onClick={() => navigate("/logout")}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <h1 className="ml-1">Logout</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditProfileModal && (
        <EditProfileModal
          profile={user}
          type={type}
          onClose={() => setShowEditProfileModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
