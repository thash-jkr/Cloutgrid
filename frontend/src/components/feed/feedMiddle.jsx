import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquare,
  faCircleUp as unlike,
} from "@fortawesome/free-regular-svg-icons";

import "./feed.css";
import CommentModal from "./commentModal";
import { useNavigate } from "react-router-dom";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed, likePost } from "../../slices/feedSlice";
import Loader from "../../common/loading";
import toast, { Toaster } from "react-hot-toast";

const MiddleColumn = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [animatingId, setAnimatingId] = useState(-1);

  const navigate = useNavigate();
  const lastTapef = useRef(null);
  const dispatch = useDispatch();

  const { type } = useSelector((state) => state.auth);
  const { posts, postLoading, postError } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed())
      .unwrap()
      .then()
      .catch((error) => {
        toast.error("Error fetching posts");
        console.log("Post fetching error", error);
      });
  }, []);

  const handleTap = (id) => {
    console.log();
    const now = new Date().getTime();
    const delay = 300;

    if (now - lastTapef.current < delay) {
      handleClick(id);
    }

    lastTapef.current = now;
  };

  const handleClick = (id) => {
    setAnimatingId(id);
    handleLike(id);
    setTimeout(() => {
      setAnimatingId(-1);
    }, 300);
  };

  const handleLike = (id) => {
    dispatch(likePost(id));
  };

  const handleComment = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  return (
    <div className="center-vertical noselect">
      {postLoading && <Loader />}
      <Toaster />
      <div className="w-full px-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="center-vertical mb-5 rounded-xl shadow bg-white divide-y"
            >
              <div className="flex justify-start items-center w-full m-3 pl-3">
                <img
                  src={`${post.author.profile_photo}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <h3
                  onClick={() => navigate(`/profiles/${post.author.username}`)}
                  className="font-bold cursor-pointer"
                >
                  {post.author.name}
                </h3>
                {post.collaboration && (
                  <h3
                    onClick={() =>
                      navigate(`/profiles/${post.collaboration.user.username}`)
                    }
                    className="font-bold cursor-pointer"
                  >
                    <span className="mx-1 font-normal text-black">with</span>
                    {post.collaboration.user.name}
                  </h3>
                )}
              </div>

              <div className="center-vertical w-full">
                <div className="w-full m-5 pl-3">
                  <p>{post.caption}</p>
                </div>
                <img
                  src={`${post.image}`}
                  alt="Post"
                  className="w-full"
                  onClick={() => {
                    !post.is_liked && handleTap(post.id);
                  }}
                />
              </div>

              <div className="flex justify-around items-center p-5 w-full">
                <FontAwesomeIcon
                  icon={post.is_liked ? faCircleUp : unlike}
                  className={`text-3xl transition-transform duration-300 ${
                    animatingId === post.id ? "scale-125 text-red-700" : ""
                  }`}
                  onClick={() => handleClick(post.id)}
                />
                <div className="center w-1/2 font-bold">
                  <p className="center w-full">
                    {post.like_count} Hits | {post.comment_count} Comments
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={faSquare}
                  onClick={() => handleComment(post)}
                  className="text-3xl"
                />
              </div>
            </div>
          ))
        ) : (
          <h1>No posts to display</h1>
        )}
      </div>

      {showCommentModal && (
        <CommentModal
          post={selectedPost}
          onClose={() => setShowCommentModal(false)}
        />
      )}
    </div>
  );
};

export default MiddleColumn;
