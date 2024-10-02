import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import homeStyles from "../styles/home";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Toggle from "react-native-toggle-element";

const Notifications = () => {
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const accessToken = await SecureStore.getItemAsync("access");
      try {
        const response = await axios.get(
          `http://192.168.1.106:8001/notifications/?all=${showAll}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [showAll]);

  const handleClose = async (id) => {
    const accessToken = await SecureStore.getItemAsync("access");
    try {
      await axios.post(
        `http://192.168.1.106:8001/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  return (
    <SafeAreaView style={homeStyles.home}>
      <Text style={homeStyles.h2}>Notifications</Text>
      <View style={homeStyles.toggle}>
        <Text style={homeStyles.toggleText}>Show All</Text>
        <Toggle
          trackBar={{
            width: 35,
            height: 20,
          }}
          thumbButton={{
            width: 20,
            height: 20,
          }}
          value={!showAll}
          onPress={() => setShowAll(!showAll)}
        />
        <Text style={homeStyles.toggleText}>Show unread</Text>
      </View>
      <ScrollView style={homeStyles.bars}>
        {notifications.length > 0 ? (
          <View>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={homeStyles.bar}
                onPress={() => handleClose(notification.id)}
              >
                <Text>{notification.message}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text>No notifications</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
