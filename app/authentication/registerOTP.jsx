import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";

const OtpVerification = ({ nextStep, prevStep }) => {
  return (
    <View style={authStyles.container}>
      <Text style={authStyles.h1}>OTP Verification</Text>

      <Text style={{ marginBottom: 20 }}>
        Please enter the OTP sent to your email.
      </Text>

      <TextInput
        style={authStyles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
      />

      <View style={{ flexDirection: "row" }}>
        <CustomButton title="Go Back" onPress={prevStep} />
        <CustomButton title="Continue" onPress={nextStep} />
      </View>
    </View>
  );
};

export default OtpVerification;
