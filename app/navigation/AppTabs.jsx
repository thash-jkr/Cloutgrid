import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../tabs/home";
import Profile from "../tabs/profile";
import Dashboard from "../tabs/dashboard";
import Search from "../tabs/search";
import Jobs from "../tabs/jobs";
import { Ionicons } from "@expo/vector-icons";
import Profiles from "../common/profiles";
import LoggedOutHome from "../authentication/loggedoutHome";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Dashboard") {
            iconName = "grid";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Jobs") {
            iconName = "briefcase";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#283618",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Jobs" component={Jobs} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const ProtectedStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="MainTabs">
      <Stack.Screen name="MainTabs" component={AppTabs} />
      <Stack.Screen name="Profiles" component={Profiles} />
    </Stack.Navigator>
  )
}

export default ProtectedStack;
