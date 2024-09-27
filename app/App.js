import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import AuthStack from "./navigation/AuthStack";
import AppTabs from "./navigation/AppTabs";
import "./interceptor/axios";

export default function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("access");
        setAuth(!!token);
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {auth ? <AppTabs /> : <AuthStack />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
