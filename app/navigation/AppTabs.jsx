import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../tabs/home";
import Profile from "../tabs/profile";
import Search from "../tabs/search";
import Jobs from "../tabs/jobs";
import JobCreate from "../tabs/jobCreate";
import { Ionicons } from "@expo/vector-icons";
import Profiles from "../common/profiles";
import Notifications from "../common/notifications";
import MyJobs from "../tabs/myJobs";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppTabs = () => {
  const [type, setType] = useState("");

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const token = await SecureStore.getItemAsync("access");
        if (!token) {
          return;
        }
        const response = await axios.get(
          `http://192.168.1.106:8001/user-type/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setType(response.data.type);
      } catch (error) {
        console.error("Error checking user type:", error);
      }
    };

    checkUserType();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Jobs") {
            iconName = "briefcase";
          } else if (route.name === "CreateJob") {
            iconName = "add-circle";
          } else if (route.name === "MyJobs") {
            iconName = "briefcase";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#283618",
        tabBarInactiveTintColor: "#7E9763",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#DBE3D3",
          borderTopColor: "#ACC495",
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      {type === "creator" && <Tab.Screen name="Jobs" component={Jobs} />}
      {type === "business" && (
        <Tab.Screen name="CreateJob" component={JobCreate} />
      )}
      {type === "business" && <Tab.Screen name="MyJobs" component={MyJobs} />}
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const ProtectedStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"
    >
      <Stack.Screen name="MainTabs" component={AppTabs} />
      <Stack.Screen name="Profiles" component={Profiles} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
};

export default ProtectedStack;
