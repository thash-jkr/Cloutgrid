import { View, Text, SafeAreaView, Image, StatusBar, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import profileStyles from "../styles/profile";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Profiles = ({ route }) => {
  const { username } = route.params;
  const [profile, setProfile] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("instagram");

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get("http://192.168.1.106:8001/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status == 200) {
          setLoggedInUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(
          `http://192.168.1.106:8001/profiles/${username}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data) {
          setProfile(response.data);
        }
        const isFollowingResponse = await axios.get(
          `http://192.168.1.106:8001/profiles/${username}/is_following/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsFollowing(isFollowingResponse.data.is_following);
      } catch (error) {
        console.log("Cannot find other user", error);
      }
    };

    fetchProfile();
  }, [username, loggedInUser, isFollowing]);

  const handleFollow = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `http://192.168.1.106:8001/profiles/${username}/follow/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsFollowing(true);
    } catch (error) {
      console.log("Error following user", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `http://192.168.1.106:8001/profiles/${username}/unfollow/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsFollowing(false);
    } catch (error) {
      console.log("Error following user", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "instagram":
        return <Text>Instagram Info</Text>;
      case "facebook":
        return <Text>Facebook Info</Text>;
      case "youtube":
        return <Text>YouTube Info</Text>;
      default:
        return <Text>Instagram Info</Text>;
    }
  };

  if (!profile) {
    return (
      <SafeAreaView style={profileStyles.profile}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.profile}>
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
        </View>
        <CustomButton
          title={isFollowing ? "Unfollow" : "Follow"}
          onPress={isFollowing ? handleUnfollow : handleFollow}
        />
      </View>
      <View style={profileStyles.profileBottom}>
      <View style={profileStyles.tabsContainer}>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "instagram" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("instagram")}
          >
            <Text style={profileStyles.tabText}>Instagram{" "}</Text>
            <FontAwesomeIcon icon={faInstagram} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "facebook" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("facebook")}
          >
            <Text style={profileStyles.tabText}>Facebook{" "}</Text>
            <FontAwesomeIcon icon={faFacebook} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "youtube" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("youtube")}
          >
            <Text style={profileStyles.tabText}>YouTube{" "}</Text>
            <FontAwesomeIcon icon={faYoutube} size={20} />
          </TouchableOpacity>
        </View>

        <View style={profileStyles.profileSocial}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

export default Profiles;
