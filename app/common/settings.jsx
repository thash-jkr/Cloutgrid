import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton'
import profileStyles from '../styles/profile'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'

const Settings = () => {
  const navigation = useNavigation()

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");
      const access = await SecureStore.getItemAsync("access");
      if (!refresh) {
        console.log("No refresh token found");
        return;
      }

      const response = await axios.post(
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
      navigation.reset({
        index: 0,
        routes: [{ name: "LoggedoutHome" }],
      });
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
    <SafeAreaView style={profileStyles.profile}>
      <Text style={profileStyles.h2}>Settings</Text>
      <View style={profileStyles.footer}>
      <CustomButton title="Clear Tokens" onPress={clearSecureStoreTokens} />
      <CustomButton title="Logout" onPress={handleLogout}/>
      </View>
    </SafeAreaView>
  )
}

export default Settings