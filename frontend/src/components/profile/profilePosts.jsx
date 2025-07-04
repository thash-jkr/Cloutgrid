import React, { useState } from "react";
import PostModal from "../../modals/postModal";
import CommentModal from "../../modals/commentModal";

const ProfilePosts = ({ posts }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="p-2 lg:p-3 grid grid-cols-2 xl:grid-cols-3 gap-1 lg:gap-3 w-full">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="relative w-full aspect-square overflow-hidden rounded lg:hover:scale-[101%] transition-transform"
            onClick={() => {
              setSelectedPost(post);
              setShowPostModal(true);
            }}
          >
            <img
              src={`${post.image}`}
              alt="Post"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <h1>No posts found!</h1>
        </div>
      )}

      {showPostModal && (
        <PostModal
          onClose={() => {
            setShowPostModal(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
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

export default ProfilePosts;
