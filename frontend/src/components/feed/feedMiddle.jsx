import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";

import "./feed.css";
import CommentModal from "./commentModal";
import PostModal from "./postModal";
import Checkbox from "../../common/like";

const MiddleColumn = ({ type }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

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
  }, [showCommentModal]);

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
            is_liked: response.data.message === "Post liked",
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
    setShowCommentModal(true);
  };

  const handleNewPostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="middle-container">
      <div className="home-postcreate">
        <button className="button-54" onClick={() => setShowPostModal(true)}>
          Create a new Post
        </button>
      </div>
      <div className="home-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="home-post">
              <div className="home-post-header">
                <img src={`${post.author.profile_photo}`} alt="Profile" />
                <h3>{post.author.name}</h3>
                {post.collaboration && (
                  <h3>
                    <span style={{ margin: "0px 10px", fontWeight: "300" }}>
                      collaborating with
                    </span>
                    {post.collaboration.user.name}
                  </h3>
                )}
              </div>

              <div className="post">
                <div className="post-caption">
                  <p>{post.caption}</p>
                </div>
                <img src={`${post.image}`} alt="Post" />
              </div>

              <div className="post-footer">
                <p>
                  {post.like_count} likes | {post.comment_count} comments
                </p>
                <div className="post-interaction">
                  <Checkbox
                    like={() => handleLike(post.id)}
                    liked={post.is_liked}
                  />
                  <FontAwesomeIcon
                    icon={faComment}
                    style={{ fontSize: 30, cursor: "pointer" }}
                    onClick={() => handleComment(post)}
                  />
                </div>
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

      {showPostModal && (
        <PostModal
          onPostCreated={handleNewPostCreated}
          onClose={() => setShowPostModal(false)}
          type={type}
        />
      )}
    </div>
  );
};

export default MiddleColumn;
