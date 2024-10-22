import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

import "./feed.css";
import CommentModal from "./commentModal";

const MiddleColumn = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            like_count:
              response.data.message === "Post liked"
                ? post.like_count + 1
                : post.like_count - 1,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="middle-container">
      <div className="home-postcreate">
        <button className="button-54">Create a new Post</button>
      </div>
      <div className="home-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="home-post">
              <div className="home-post-header">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${post.author.profile_photo}`}
                  alt="Profile"
                />
                <h3>{post.author.name}</h3>
              </div>

              <div className="post">
                <div className="post-caption">
                  <p>{post.caption}</p>
                </div>
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${post.image}`}
                />
              </div>

              <div className="post-footer">
                <p>
                  {post.like_count} likes | {post.comment_count} comments
                </p>
                <div className="post-interaction">
                  <button
                    className="button-54"
                    onClick={() => handleLike(post.id)}
                  >
                    <span>
                      <FontAwesomeIcon icon={faHeart} />
                    </span>{" "}
                    Like
                  </button>
                  <button
                    className="button-54"
                    onClick={() => handleComment(post)}
                  >
                    <span>
                      <FontAwesomeIcon icon={faComment} />
                    </span>{" "}
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>No posts to display</h1>
        )}
      </div>

      {showModal && (
        <CommentModal post={selectedPost} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default MiddleColumn;
