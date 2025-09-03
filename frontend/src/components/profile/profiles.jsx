import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
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
import NavBar from "../../common/navBar";
import PostModal from "../../modals/postModal";
import CommentModal from "../../modals/commentModal";
import OtherInstagram from "./otherInstagram";

const Profiles = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { otherProfile, otherPosts, otherCollabs } = useSelector(
    (state) => state.profiles
  );

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

  useEffect(() => {
    selectedPost && setShowPostModal(true);
  }, [selectedPost]);

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <ProfilePosts posts={otherPosts} setSelectedPost={setSelectedPost} />
        );

      case "instagram":
        return <OtherInstagram otherProfile={otherProfile} />;

      case "youtube":
        return (
          <div className="center-vertical mt-10 text-xl font-bold">
            <FontAwesomeIcon icon={faTriangleExclamation} size={"3x"} />
            <h1>
              {otherProfile?.user.name} hasn't connected their Youtube yet!
            </h1>
          </div>
        );

      case "collabs":
        return (
          <ProfilePosts
            posts={otherCollabs}
            setSelectedPost={setSelectedPost}
          />
        );
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
      <NavBar />
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
                className="px-3 py-2 bg-orange-500 text-white my-2 mt-5 rounded-full font-extrabold text-sm 
               transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow"
              >
                {otherProfile?.user.user_type === "creator"
                  ? AREA_OPTIONS_OBJECT[otherProfile?.area]
                  : AREA_OPTIONS_OBJECT[otherProfile?.target_audience]}
              </p>
            </div>

            <div className="flex center-vertical w-full p-5 border-b">
              <div className="flex justify-around items-center w-full">
                <div className="w-1/2 center-vertical">
                  <img
                    className="w-28 h-28 rounded-full object-cover"
                    src={`${process.env.REACT_APP_API_BASE_URL}${otherProfile?.user.profile_photo}`}
                    alt="Profile"
                  />
                </div>
                <div className="w-1/2 h-full flex flex-col justify-around">
                  <div className="center">
                    <h1 className="mr-2">
                      {otherProfile?.user.followers_count}
                    </h1>
                    <h1>Followers</h1>
                  </div>
                  <div className="center">
                    <h1 className="mr-2">
                      {otherProfile?.user.following_count}
                    </h1>
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

              {otherProfile?.user.user_type === "business" &&
                otherProfile?.website && (
                  <p
                    className="px-3 py-2 bg-orange-500 text-white my-2 mt-5 rounded-full font-extrabold text-sm 
               transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow"
                  >
                    {otherProfile?.website}
                  </p>
                )}
            </div>

            <div className="px-1 py-5">
              <p>{otherProfile?.user.bio}</p>
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
                {activeTab === "posts" && (
                  <span>
                    <FontAwesomeIcon icon={faCircle} className="text-xs ml-2" />
                  </span>
                )}
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
                  {activeTab === "instagram" && (
                    <span>
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-xs ml-2"
                      />
                    </span>
                  )}
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
                  {activeTab === "youtube" && (
                    <span>
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-xs ml-2"
                      />
                    </span>
                  )}
                </button>
              )}

              {otherProfile?.user.user_type === "business" && (
                <button
                  className="button-54"
                  onClick={() => setActiveTab("collabs")}
                >
                  Collabs
                  {activeTab === "collabs" && (
                    <span>
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-xs ml-2"
                      />
                    </span>
                  )}
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

      {showPostModal && (
        <PostModal
          onClose={() => {
            setShowPostModal(false);
            setSelectedPost(null);
          }}
          postId={selectedPost.id}
          showComment={() => {
            setShowPostModal(false);
            setShowCommentModal(true);
          }}
        />
      )}

      {showCommentModal && (
        <CommentModal
          post={selectedPost}
          onClose={() => {
            setShowCommentModal(false);
            setShowPostModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Profiles;
