import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import React from "react";

const ProfilePosts = ({ posts }) => {
  const { height, width } = Dimensions.get("window");

  const renderRow = (rowPosts) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 3,
        }}
      >
        {rowPosts.map((post) => (
          <View key={post.id} style={{ marginHorizontal: 3 }}>
            <Image
              style={{ width: width / 3, height: width / 3 }}
              source={{ uri: `http://192.168.1.106:8001${post.image}` }}
            />
          </View>
        ))}
      </View>
    );
  };

  const postsInRows = [];
  for (let i = 0; i < posts.length; i += 3) {
    postsInRows.push(posts.slice(i, i + 3));
  }

  return (
    <ScrollView>
      {posts.length > 0 ? (
        postsInRows.map((rowPosts, index) => (
          <React.Fragment key={index}>{renderRow(rowPosts)}</React.Fragment>
        ))
      ) : (
        <Text>No posts found.</Text>
      )}
    </ScrollView>
  );
};

export default ProfilePosts;
