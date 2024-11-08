import React from "react";

const ProfilePosts = ({ posts }) => {
  const renderRow = (rowPosts) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {rowPosts.map((post) => (
          <div
            key={post.id}
            style={{
              flex: "1 1 33%",
              margin: "5px",
              overflow: "cover",
            }}
          >
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${post.image}`}
              alt={post.caption}
              style={{
                width: "100%",
                height: "400px", // Fixed height for consistency
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const postsInRows = [];
  for (let i = 0; i < posts.length; i += 3) {
    postsInRows.push(posts.slice(i, i + 3));
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "10px", // Adds padding around the entire post grid
      }}
    >
      {posts.length > 0 ? (
        postsInRows.map((rowPosts, index) => (
          <React.Fragment key={index}>{renderRow(rowPosts)}</React.Fragment>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default ProfilePosts;
