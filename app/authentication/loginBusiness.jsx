import React, { useState } from "react";
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
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";

const LoginCreator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {};

  return (
    <View style={authStyles.loginContainer}>
      <Text style={authStyles.title}>Business Login</Text>
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
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={authStyles.footerText}>Don't have an account? Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={authStyles.footerText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginCreator;
