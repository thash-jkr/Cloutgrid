import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

import CustomButton from "../components/CustomButton";
import authStyles from "../styles/auth";

const BasicInfo = ({ nextStep, formData, handleChange, type }) => {
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.h1}>Join as a {type === "creator" ? "Creator" : "Business"}</Text>
      <TextInput
        style={authStyles.input}
        placeholder="Enter your name:"
        placeholderTextColor="#000"
        value={formData.user.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Enter your Email:"
        placeholderTextColor="#000"
        keyboardType="email-address"
        value={formData.user.email}
        onChangeText={(value) => handleChange("email", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Enter a username:"
        placeholderTextColor="#000"
        value={formData.user.username}
        onChangeText={(value) => handleChange("username", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Choose a strong Password:"
        placeholderTextColor="#000"
        secureTextEntry={true}
        value={formData.user.password}
        onChangeText={(value) => handleChange("password", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Enter the password again:"
        placeholderTextColor="#000"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(value) => handleConfirmPassword(value)}
      />

      <CustomButton
        title="Continue"
        onPress={nextStep}
        // disabled={formData.user.password !== confirmPassword}
      />
    </View>
  );
};

export default BasicInfo;
