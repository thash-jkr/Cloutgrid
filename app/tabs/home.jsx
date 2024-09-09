import {
  View,
  Text,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import homeStyles from "../styles/home";
import CustomButton from "../components/CustomButton";
import { getCSRFToken } from "../getCSRFToken";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [user, setUser] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");

        if (!accessToken) {
          console.log("No access token found");
          return;
        }
        const response = await axios.get("http://192.168.1.106:8001/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");
      const access = await SecureStore.getItemAsync("access");
      if (!refresh) {
        console.log("No refresh token found");
        return;
      }
      const csrfToken = await getCSRFToken();

      const response = await axios.post(
        "http://192.168.1.106:8001/logout/",
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Authorization: `Bearer ${access}`,
          },
        }
      );

      await SecureStore.deleteItemAsync("access");
      await SecureStore.deleteItemAsync("refresh");
      axios.defaults.headers.common["Authorization"] = null;
      navigation.navigate("LoggedoutHome");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const clearSecureStoreTokens = async () => {
    try {
      await SecureStore.deleteItemAsync("access");
      await SecureStore.deleteItemAsync("refresh");
      console.log("Tokens cleared from SecureStore.");
    } catch (error) {
      console.error("Error clearing tokens from SecureStore:", error);
    }
  };

  return (
    <View style={homeStyles.home}>
      <Text>Welcome {user.name}</Text>
      <CustomButton title="Logout" onPress={handleLogout} />
      <CustomButton title="Clear Tokens" onPress={clearSecureStoreTokens} />
      <Image
        source={{ uri: `http://192.168.1.106:8001${user.profile_photo}` }}
        style={homeStyles.profilePicture}
      />
    </View>
  );
};

export default Home;
