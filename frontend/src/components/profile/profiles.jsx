import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

import ProfilePosts from "./profilePosts";
import Loader from "../../common/loading";
import {
  fetchOtherCollabs,
  fetchOtherPosts,
  fetchOtherProfile,
  handleFollow,
  handleUnfollow,
} from "../../slices/profilesSlice";
import Navbar from "../navBar";

const Profiles = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    otherProfile,
    otherPosts,
    otherCollabs,
    profilesLoading,
    profilesError,
  } = useSelector((state) => state.profiles);

  useEffect(() => {
    if (username === user?.user.username) {
      navigate("/profile");
    }
    dispatch(fetchOtherProfile(username));
    dispatch(fetchOtherPosts(username));
  }, [dispatch, username]);

  useEffect(() => {
    otherProfile?.user.user_type === "business" &&
      otherProfile?.user.username === username &&
      dispatch(fetchOtherCollabs(username));
  }, [username, dispatch, otherProfile]);

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={otherPosts} />;

      case "instagram":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} size={"5x"} />
            <div>
              {otherProfile?.user.name} hasn't connected their Instagram yet!
            </div>
          </div>
        );

      case "youtube":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} size={"5x"} />
            <div>
              {otherProfile?.user.name} hasn't connected their Youtube yet!
            </div>
          </div>
        );

      case "collabs":
        return <ProfilePosts posts={otherCollabs} />;
      default:
        return <Loader />;
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
      <Navbar />
      {profilesLoading && <Loader />}
      <div className="flex basis-1/4 w-full">
        <div className="center-vertical w-full lg:mr-5 mb-5 lg:mb-0 px-3 lg:px-0">
          <div
            className="center-vertical shadow w-full rounded-xl bg-white font-semibold text-xl 
            xl:text-lg md:text-base"
          >
            <div className="center-vertical w-full py-3 border-b">
              <h1>
                {otherProfile?.user.name} | @{otherProfile?.user.username}
              </h1>

              <p
                className="px-3 py-2 bg-blue-200 my-2 mt-5 rounded-full font-bold text-sm 
               transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow hover:bg-blue-300"
              >
                {otherProfile?.user.user_type === "creator"
                  ? AREA_OPTIONS_OBJECT[otherProfile?.area]
                  : AREA_OPTIONS_OBJECT[otherProfile?.target_audience]}
              </p>
            </div>

            <div className="flex flex-row lg:flex-col xl:flex-row w-full h-full justify-around items-center p-5 border-b">
              <div className="center-vertical">
                <img
                  className="w-28 h-28 rounded-full object-cover"
                  src={`${process.env.REACT_APP_API_BASE_URL}${otherProfile?.user.profile_photo}`}
                  alt="Profile"
                />
              </div>

              <div className="flex flex-col justify-around items-end">
                <div className="center">
                  <h1 className="mr-2">{otherProfile?.user.followers_count}</h1>
                  <h1>Followers</h1>
                </div>
                <div className="center">
                  <h1 className="mr-2">{otherProfile?.user.following_count}</h1>
                  <h1>Following</h1>
                </div>
                <div className="center">
                  <h1 className="mr-2">{otherPosts.length}</h1>
                  <h1>Posts</h1>
                </div>
                {otherProfile?.user.user_type === "business" && (
                  <div className="center">
                    <h1 className="mr-2">{otherCollabs.length}</h1>
                    <h1>Collabs</h1>
                  </div>
                )}
              </div>
            </div>

            <div className="px-1 py-5">
              <p>{user?.user.bio}</p>
            </div>

            <div className="px-1 py-5">
              {otherProfile?.is_following ? (
                <button
                  className="button-54"
                  onClick={() => dispatch(handleUnfollow(username))}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="button-54"
                  onClick={() => dispatch(handleFollow(username))}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex basis-3/4 w-full">
        <div className="flex w-full">
          <div className="w-full px-3">
            <div className="bg-white p-3 rounded-2xl shadow flex justify-around items-center mb-5 w-full">
              <button
                className="button-54"
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>

              {otherProfile?.user.user_type === "creator" && (
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

              {otherProfile?.user.user_type === "creator" && (
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

              {otherProfile?.user.user_type === "business" && (
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
      </div>
    </div>
  );
};

export default Profiles;
