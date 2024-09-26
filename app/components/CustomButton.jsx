import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress, disabled }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={1}
      style={[
        styles.button,
        isPressed && styles.buttonPressed, // Apply "hover" style when pressed
        disabled && styles.buttonDisabled, // Apply "disabled" style
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2C3A1C",
    borderRadius: 20, // 1.5rem = 24px in React Native
    paddingVertical: 10, // 1rem = 16px
    paddingHorizontal: 15, // 1.6rem = 24px
    textAlign: "center",
    justifyContent: "center",
    shadowColor: "rgba(166, 175, 195, 0.25)", // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },   // Shadow offset for iOS
    shadowOpacity: 1,
    shadowRadius: 2,    // Equivalent to box-shadow in CSS
    elevation: 2,       // Shadow for Android
    margin: 10,         // Add margin around the button
  },
  buttonText: {
    color: "#E6E9E3",
    fontWeight: "Bold",
    fontSize: 18, // 1.1rem = 18px in React Native
    fontFamily: "sans-serif", // Specify the desired font-family available in React Native or a custom one
  },
  buttonPressed: {
    backgroundColor: "#606c38", // For "hover" state
  },
  buttonDisabled: {
    backgroundColor: "#606c38", // Disabled state background
    color: "#fefae0",           // Disabled text color
    opacity: 0.7,               // Reduce opacity for disabled state
  },
});
