import { View, Text, Alert, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import jobsStyles from "../styles/jobs";
import CustomButton from "../components/CustomButton";

const PostCreate = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0]["uri"];
      const fileName = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error("Failed to load image"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", localUri, true);
        xhr.send(null);
      });

      setImage({
        uri: localUri,
        name: fileName,
        type: fileType,
        file: blob,
      });
    }
  };

  const handlePostSubmit = async () => {
    if (!caption || !image) {
      Alert.alert("Please provide both an image and a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
    }

    try {
      const access = await SecureStore.getItemAsync("access");
      await axios.post(`http://192.168.1.106:8001/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCaption("");
      setImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <View style={jobsStyles.container}>
      <Text style={jobsStyles.h1}>Create a Post</Text>

      <View style={jobsStyles.input}>
        <TouchableOpacity onPress={handleImageChange}>
          <Text>Select an Image to Post</Text>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {image && <FontAwesome icon={faCheck} size={24} color="green" />}
        </View>
      </View>

      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={(text) => setCaption(text)}
        style={jobsStyles.input}
      />

      <CustomButton title="Create Post" onPress={handlePostSubmit} />
    </View>
  );
};

export default PostCreate;