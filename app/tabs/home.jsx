import { View, Text, Image, StatusBar, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import homeStyles from "../styles/home";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  

  return (
    <SafeAreaView style={homeStyles.home}>
      <StatusBar backgroundColor="#E6E9E3" />
      <TouchableOpacity
        style={homeStyles.bell}
        onPress={() => navigation.navigate("Notifications")}
      >
        <FontAwesomeIcon icon={faBell} size={25} />
      </TouchableOpacity>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={homeStyles.horizontalScroll}
        contentContainerStyle={homeStyles.horizontalScrollContent}
      >
        {/* Block 1 - Quick Links */}
        <View style={homeStyles.scrollBlock}>
          <Text style={homeStyles.blockTitle}>Quick Links</Text>
          {/* Content for Quick Links */}
        </View>

        {/* Block 2 - Suggested Users */}
        <View style={homeStyles.scrollBlock}>
          <Text style={homeStyles.blockTitle}>Suggested Users</Text>
          {/* Content for Suggested Users */}
        </View>

        {/* Block 3 - Recent Jobs */}
        <View style={homeStyles.scrollBlock}>
          <Text style={homeStyles.blockTitle}>Recent Jobs</Text>
          {/* Content for Recent Jobs */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
