import {
  faSquare,
  faCircleUp as unlike,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleUp, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../slices/feedSlice";
import { selectPostById } from "../slices/profileSlice";

const PostModal = ({ onClose, postId, showComment}) => {
  const [animatingId, setAnimatingId] = useState(-1);
  const post = useSelector((state) => selectPostById(state, postId));

  const lastTapRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  const handleTap = (id) => {
    const now = new Date().getTime();
    const delay = 300;

    if (now - lastTapRef.current < delay) {
      handleClick(id);
    }

    lastTapRef.current = now;
  };

  const handleClick = (id, isLike = false) => {
    !isLike && setAnimatingId(id);
    handleLike(id);
    setTimeout(() => {
      setAnimatingId(-1);
    }, 300);
  };

  const handleLike = (id) => {
    dispatch(likePost(id));
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Post</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body w-full overflow-y-scroll noscroll">
          <img
            src={post?.image}
            className="w-full"
            onClick={() => {
              !post.is_liked && handleTap(post.id);
            }}
          />
          <div className="w-full px-3">
            <div>
              <h1 className="py-2 font-bold">{post?.author.username}</h1>
            </div>
            <p>{post?.caption}</p>
          </div>
        </div>

        <div className="flex justify-around items-center p-5 w-full">
          <FontAwesomeIcon
            icon={post?.is_liked ? faCircleUp : unlike}
            className={`text-3xl transition-transform duration-300 ${
              post?.is_liked && "text-orange-500"
            } ${animatingId === post?.id ? "scale-125" : ""}`}
            onClick={() => handleClick(post?.id, post?.is_liked)}
          />
          <div className="center w-1/2 font-bold">
            <p className="center w-full">
              {post?.like_count} Hits | {post?.comment_count} Comments
            </p>
          </div>
          <FontAwesomeIcon
            icon={faSquare}
            onClick={showComment}
            className="text-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default PostModal;
