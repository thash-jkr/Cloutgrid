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
  }, [dispatch]);

  useEffect(() => {
    otherProfile?.user.user_type === "business" &&
      dispatch(fetchOtherCollabs(username));
  }, [otherProfile]);

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

  if (profilesError) {
    return <div>{profilesError}</div>;
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
    <div className="profile" style={{backgroundColor: "#f5faff"}}>
      <Navbar />
      {profilesLoading && <Loader />}
      <div className="profile-container">
        <div className="profile-left">
          <img
            className="profile-photo"
            src={`${process.env.REACT_APP_API_BASE_URL}${otherProfile?.user.profile_photo}`}
            alt="Profile"
          />
          <div className="profile-details">
            <p>
              <span className="detail-label">
                {otherProfile?.user.name} |{" "}
                <span className="detail-label">
                  @{otherProfile?.user.username}
                </span>
              </span>
            </p>
            <p>{otherProfile?.user.bio}</p>
            <p
              style={{
                backgroundColor: "#CAF0F8",
                padding: "5px 10px",
                borderRadius: "20px",
              }}
            >
              {otherProfile?.user.user_type === "creator"
                ? AREA_OPTIONS_OBJECT[otherProfile?.area]
                : AREA_OPTIONS_OBJECT[otherProfile?.target_audience]}
            </p>
          </div>

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
        <div className="profile-main">
          <div className="profile-reach">
            <div>
              <h1>{otherProfile?.user.followers_count}</h1>
              <h1>Followers</h1>
            </div>
            <div>
              <h1>{otherProfile?.user.following_count}</h1>
              <h1>Following</h1>
            </div>
            <div>
              <h1>{otherPosts.length}</h1>
              <h1>Posts</h1>
            </div>
            {otherProfile?.user.user_type === "business" && (
              <div>
                <h1>{otherCollabs.length}</h1>
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

            <div className="social-detail">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
