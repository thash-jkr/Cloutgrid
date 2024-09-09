import { View, Text } from "react-native";
import React, { useState } from "react";
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";

const Login = () => {
  const [type, setType] = useState("Creator");
  const toggleCreator = () => setType("Creator");
  const toggleBusiness = () => setType("Business");

  return (
    <View style={authStyles.container}>
      <View style={authStyles.loginButtons}>
        <CustomButton title="Creator" onPress={toggleCreator} />
        <CustomButton title="Business" onPress={toggleBusiness} />
      </View>
      {type === "Creator" ? <LoginCreator /> : <LoginBusiness />}
    </View>
  );
};

export default Login;
