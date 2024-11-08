import {
  View,
  Text,
  Image,
  StatusBar,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import profileStyles from "../styles/profile";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditProfileModal from "../components/EditProfileModal";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import ProfilePosts from "../common/profilePosts";

import Config from "../config";

const Profile = () => {
  const [type, setType] = useState("creator");
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(`${Config.BASE_URL}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!profile) {
          return;
        }
        const access = await SecureStore.getItemAsync("access");
        const response = await axios.get(
          `${Config.BASE_URL}/posts/${profile.user.username}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        if (response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [profile]);

  const handleSave = async (updatedProfile) => {
    try {
      const data = new FormData();
      data.append("user[name]", updatedProfile.user.name);
      data.append("user[email]", updatedProfile.user.email);
      data.append("user[username]", updatedProfile.user.username);
      if (updatedProfile.user.profile_photo) {
        data.append("user[profile_photo]", updatedProfile.user.profile_photo);
      }

      if (updatedProfile.user.password) {
        data.append("user[password]", updatedProfile.user.password);
      }

      data.append("user[bio]", updatedProfile.user.bio);
      if (profile.area) {
        data.append("date_of_birth", updatedProfile.date_of_birth);
        data.append("area", updatedProfile.area);
      } else {
        data.append("website", updatedProfile.website);
      }

      const response = await axios.put(
        `${Config.BASE_URL}/profile/creator/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Profile updated successfully!");
        setProfile(response.data);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={posts} />;
      case "instagram":
        return (
          <View>
            <CustomButton title="Connect Instagram" />
          </View>
        );
      case "tiktok":
        return (
          <View>
            <CustomButton title="Connect Tiktok" />
          </View>
        );
      case "youtube":
        return (
          <View>
            <CustomButton title="Connect YouTube" />
          </View>
        );
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
      <StatusBar backgroundColor="#ECEEEA" />
      <View style={profileStyles.profileTop}>
        <View style={profileStyles.profileDetails}>
          <Image
            source={{
              uri: `${Config.BASE_URL}${profile.user.profile_photo}`,
            }}
            style={profileStyles.profilePicture}
          />
          <View style={profileStyles.profileData}>
            <View style={profileStyles.profileCount}>
              <Text>{posts.length}</Text>
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
          <CustomButton
            title="Edit Profile"
            onPress={() => setModalVisible(true)}
          />
          <CustomButton
            title="Settings"
            onPress={() => navigation.navigate("Settings")}
          />
        </View>
      </View>
      <View style={profileStyles.profileBottom}>
        <View style={profileStyles.tabsContainer}>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "posts" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={{ fontWeight: "bold" }}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "instagram" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("instagram")}
          >
            <FontAwesomeIcon icon={faInstagram} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "tiktok" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("tiktok")}
          >
            <FontAwesomeIcon icon={faTiktok} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "youtube" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("youtube")}
          >
            <FontAwesomeIcon icon={faYoutube} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView>{renderContent()}</ScrollView>
      </View>

      {modalVisible && (
        <EditProfileModal
          profile={profile}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
