import { View, Text, SafeAreaView, Image, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import profileStyles from "../styles/profile";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../components/CustomButton";

const Profile = () => {
  const [type, setType] = useState("creator");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get("http://192.168.1.106:8001/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status == 200) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();

    if (profile) {
      profile.area ? setType("creator") : setType("business");
    }
  }, []);

  if (!profile) {
    return (
      <SafeAreaView style={profileStyles.profile}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.profile}>
      <StatusBar backgroundColor="#E6E9E3" />
      <View style={profileStyles.profileTop}>
        <View style={profileStyles.profileDetails}>
          <Image
            source={{
              uri: `http://192.168.1.106:8001${profile.user.profile_photo}`,
            }}
            style={profileStyles.profilePicture}
          />
          <View style={profileStyles.profileData}>
            <View style={profileStyles.profileCount}>
              <Text>0</Text>
              <Text>Posts</Text>
            </View>
            <View style={profileStyles.profileCount}>
              <Text>{profile.user.followers_count}</Text>
              <Text>Followers</Text>
            </View>
            <View style={profileStyles.profileCount}>
              <Text>{profile.user.following_count}</Text>
              <Text>Following</Text>
            </View>
          </View>
        </View>
        <View style={profileStyles.profileBio}>
          <Text>{profile.user.name}</Text>
          <Text>{profile.user.bio}</Text>
          <View style={profileStyles.profileArea}>
            <Text>{profile.area ? profile.area : profile.target_audience}</Text>
          </View>
        </View>
        <View style={profileStyles.button}>
          <CustomButton title="Edit Profile" />
        </View>
      </View>
      <View style={profileStyles.profileBottom}>
        <Text>Profile Bottom</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
