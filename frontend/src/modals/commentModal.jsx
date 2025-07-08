import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const CommentModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${post.id}/comments/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data) {
          setComments(response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post]);

  const handleAddComment = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${post.id}/comments/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="modal-background" id="comment-modal">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Comments</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body">
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
                <p>No comments yet</p>
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
            onClick={handleAddComment}
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
