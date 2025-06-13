import React from "react";

const ProfilePosts = ({ posts }) => {
  const renderRow = (rowPosts) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {rowPosts.map((post) => (
          <div
            key={post.id}
            style={{
              flex: "1 1 33%",
              margin: "5px",
              overflow: "cover",
              display: 'flex',
              justifyContent: "flex-start"
            }}
          >
            <img
              src={`${post.image}`}
              alt={post.caption}
              style={{
                width:
                  rowPosts.length === 3
                    ? "100%"
                    : rowPosts.length === 2
                    ? "66%"
                    : "33%",
                height: "40vh",
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
        padding: "10px",
      }}
    >
      {posts.length > 0 ? (
        postsInRows.map((rowPosts, index) => (
          <React.Fragment key={index}>{renderRow(rowPosts)}</React.Fragment>
        ))
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <h1>No posts found!</h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
