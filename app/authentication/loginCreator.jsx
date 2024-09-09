import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";
import { getCSRFToken } from "../getCSRFToken";

const LoginCreator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCSRFToken] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCSRFToken = async () => {
      const token = await getCSRFToken();
      setCSRFToken(token);
    };

    fetchCSRFToken();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.106:8001/login/creator/",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200) {
        await SecureStore.setItemAsync("access", response.data.access);
        await SecureStore.setItemAsync("refresh", response.data.refresh);
        navigation.navigate("AppTabs");
      } else {
        Alert.alert("Login Failed", "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error: ", error);
      Alert.alert("Login Failed", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={authStyles.loginContainer}>
      <Text style={authStyles.title}>Creator Login</Text>
      <TextInput
        style={authStyles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={authStyles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleSubmit} />
      <View style={authStyles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={authStyles.footerText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={authStyles.footerText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginCreator;
