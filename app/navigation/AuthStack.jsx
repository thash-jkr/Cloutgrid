import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoggedOutHome from "../authentication/loggedoutHome";
import Login from "../authentication/login";
import Register from "../authentication/register";
import RegisterCreator from "../authentication/registerCreator";
import RegisterBusiness from "../authentication/registerBusiness";
import ResetPassword from "../authentication/resetPassword";
import Logout from "../authentication/logout";
import AppTabs from "./AppTabs";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoggedoutHome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="LoggedoutHome" component={LoggedOutHome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterCreator" component={RegisterCreator} />
      <Stack.Screen name="RegisterBusiness" component={RegisterBusiness} />
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );
};

export default AuthStack;
