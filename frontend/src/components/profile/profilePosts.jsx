import React, { useState } from "react";
import PostModal from "../../modals/postModal";
import CommentModal from "../../modals/commentModal";

const ProfilePosts = ({ posts, setSelectedPost }) => {
  return (
    <div className="p-2 lg:p-3 grid sm:grid-cols-2 grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1 lg:gap-3 w-full">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="relative w-full aspect-square overflow-hidden rounded lg:hover:scale-[101%] transition-transform"
            onClick={() => {
              setSelectedPost(post);
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
        <div className="null-text">
          <h1>No posts found!</h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
