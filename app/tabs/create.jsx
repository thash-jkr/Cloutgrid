import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";

import CustomButton from "../common/CustomButton";
import JobCreate from "../common/jobCreate";
import PostCreate from "../common/postCreate";

const Create = ({ type }) => {
  const [content, setContent] = useState("post");

  return (
    <SafeAreaView
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        flex: 1,
      }}
    >
      {type === "business" && (
        <View style={{ flexDirection: "row" }}>
          <CustomButton title="Post" onPress={() => setContent("post")} />
          <CustomButton
            title="Collaboration"
            onPress={() => setContent("job")}
          />
        </View>
      )}

      {content === "job" ? (
        <JobCreate />
      ) : (
        <PostCreate />
      )}
    </SafeAreaView>
  );
};

export default Create;
