import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  clearComments,
  fetchComments,
  handleAddComment,
} from "../slices/feedSlice";
import toast, { Toaster } from "react-hot-toast";

const CommentModal = ({ post, onClose }) => {
  const [newComment, setNewComment] = useState("");

  const { comments, feedLoading } = useSelector((state) => state.feed);

  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  useEffect(() => {
    dispatch(fetchComments(post.id));

    return () => dispatch(clearComments());
  }, []);

  const addComment = () => {
    dispatch(handleAddComment({ postId: post.id, content: newComment }))
      .unwrap()
      .then(() => setNewComment(""))
      .catch((error) => toast.error("Error adding new comment!"));
  };

  return (
    <div className="modal-background">
      <Toaster />
      <div className="modal-container">
        <div className="modal-header">
          <h1>Comments</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body bg-white">
          <div className="w-full h-full divide-y">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-3 text-md">
                  <p style={{ fontWeight: "bold" }}>{comment.user.name}</p>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="null-text">
                <p>{feedLoading ? "Loading..." : "No comments yet"}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <input
            type="text"
            id="new-comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="border mx-3 h-full w-full p-3 rounded-2xl shadow"
          />
          <button
            onClick={addComment}
            className="button-54"
            disabled={newComment.length === 0}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
