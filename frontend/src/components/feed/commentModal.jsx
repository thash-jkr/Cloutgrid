import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
          <h2>Comments</h2>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>
                    {comment.user.name}: {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p>No comments yet</p>
            )}
          </div>
          <div className="comment-input">
            <input
              type="text"
              id="new-comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button onClick={handleAddComment} className="button-54">Post Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;