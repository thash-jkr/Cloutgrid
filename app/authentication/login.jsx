import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [type, setType] = useState("Creator");
  const toggleCreator = () => setType("Creator");
  const toggleBusiness = () => setType("Business");

  const navigation = useNavigation();

  return (
    <View style={authStyles.container}>
      <View style={authStyles.loginButtons}>
        <CustomButton title="Creator" onPress={toggleCreator} />
        <CustomButton title="Business" onPress={toggleBusiness} />
      </View>
      {type === "Creator" ? <LoginCreator /> : <LoginBusiness />}
      <View style={authStyles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={authStyles.footerText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
      <View style={authStyles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={authStyles.footerText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
