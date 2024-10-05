import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import profileStyles from "../styles/profile";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
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

const Settings = () => {
  const navigation = useNavigation();
  const [reload, setReload] = useState(false);

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");
      const access = await SecureStore.getItemAsync("access");
      if (!refresh) {
        console.log("No refresh token found");
        return;
      }

      await axios.post(
        "http://192.168.1.106:8001/logout/",
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
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "LoggedoutHome" }],
        })
      );
      setReload(!reload);
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
    <SafeAreaView style={profileStyles.settings}>
      <Text style={profileStyles.h1}>Settings</Text>
      <View style={profileStyles.settingsButtons}>
        {/* <CustomButton title="Clear Tokens" onPress={clearSecureStoreTokens} /> */}
        {/* <CustomButton title="Logout" onPress={handleLogout} /> */}
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
        <TouchableOpacity style={jobsStyles.job} onPress={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} size={25} />
          <Text style={{ fontSize: 20, padding: 5 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
