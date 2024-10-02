import { View, Text, Modal, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = profile.area
    ? useState({
        user: {
          name: profile.user.name,
          email: profile.user.email,
          username: profile.user.username,
          profile_photo: null,
          password: "",
          bio: profile.user.bio,
        },
        date_of_birth: profile.date_of_birth,
        area: profile.area,
      })
    : useState({
        user: {
          name: profile.user.name,
          email: profile.user.email,
          username: profile.user.username,
          profile_photo: null,
          password: "",
          bio: profile.user.bio,
        },
        website: profile.website,
        target_creator: profile.target_creator,
      });

  const handleChange = (name, value) => {
    if (
      name === "date_of_birth" ||
      name === "area" ||
      name === "website" ||
      name === "target_creator"
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [name]: value },
      }));
    }
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
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

      setFormData((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          profile_photo: {
            uri: localUri,
            name: fileName,
            type: fileType,
            file: blob,
          },
        },
      }));
    }
  };

  return (
    <View>
      <Modal transparent={true} animationType="slide">
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Name"
              value={formData.user.name}
              onChangeText={(value) => handleChange("name", value)}
            />

            <TextInput
              style={authStyles.input}
              placeholder="Email"
              value={formData.user.email}
              onChangeText={(value) => handleChange("email", value)}
            />

            <TextInput
              style={authStyles.input}
              placeholder="Username"
              value={formData.user.username}
              onChangeText={(value) => handleChange("username", value)}
            />

            <TextInput
              style={authStyles.input}
              placeholder="Bio"
              value={formData.user.bio}
              onChangeText={(value) => handleChange("bio", value)}
            />

            <TextInput
              style={authStyles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={formData.user.password}
              onChangeText={(value) => handleChange("password", value)}
            />

            <View style={authStyles.input}>
              <TouchableOpacity onPress={handleFileChange}>
                <Text>Update Profile Photo</Text>
              </TouchableOpacity>
              {formData.user.profile_photo && (
                <Image
                  source={{ uri: profile.user.profile_photo }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}
            </View>

            <View style={profileStyles.button}>
              <CustomButton title="Close" onPress={onClose} />
              <CustomButton title="Save" onPress={() => onSave(formData)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfileModal;
