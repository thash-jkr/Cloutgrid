import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import profileStyles from "../styles/profile";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import axios from "axios";
import jobsStyles from "../styles/jobs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserPlus,
  faLifeRing,
  faCircleInfo,
  faFileContract,
  faComments,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import Config from "../config";

const Settings = () => {
  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");
      const access = await SecureStore.getItemAsync("access");
      if (!refresh) {
        console.log("No refresh token found");
        return;
      }

      await axios.post(
        `${Config.BASE_URL}/logout/`,
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      await SecureStore.deleteItemAsync("access");
      await SecureStore.deleteItemAsync("refresh");
      axios.defaults.headers.common["Authorization"] = null;
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // const clearSecureStoreTokens = async () => {
  //   try {
  //     await SecureStore.deleteItemAsync("access");
  //     await SecureStore.deleteItemAsync("refresh");
  //     console.log("Tokens cleared from SecureStore.");
  //   } catch (error) {
  //     console.error("Error clearing tokens from SecureStore:", error);
  //   }
  // };

  return (
    <SafeAreaView style={profileStyles.settings}>
      <Text style={profileStyles.h1}>Settings</Text>
      <View style={profileStyles.settingsButtons}>
        {/* <CustomButton title="Clear Tokens" onPress={clearSecureStoreTokens} /> */}
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faUserPlus} size={25} />
          <Text style={{ fontSize: 20, padding: 5 }}>Follow & Invite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faLifeRing} size={25} />
          <Text style={{ fontSize: 20, padding: 5 }}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faCircleInfo} size={25} />
          <Text style={{ fontSize: 20, padding: 5 }}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faFileContract} size={25} />
          <Text style={{ fontSize: 20, padding: 5 }}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faComments} size={25} />
          <Text style={{ fontSize: 20, padding: 5 }}>Feedback</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={jobsStyles.job}>
          <Text style={{ fontSize: 20, padding: 5 }}>Clear Tokens</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={jobsStyles.job} onPress={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} size={25} />
          <Text style={{ fontSize: 20, padding: 5 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
