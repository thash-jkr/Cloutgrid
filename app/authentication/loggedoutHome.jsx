import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import homeStyles from "../styles/home";
import kid from "../assets/—Pngtree—blogger review concept vetor creative_7689749.png";

const LoggedOutHome = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={homeStyles.home}>
      <Text style={homeStyles.logo}>
        CLOUT<Text style={homeStyles.logoSide}>Grid</Text>
      </Text>
      <View style={homeStyles.split}>
        <Image source={kid} style={homeStyles.kid} />
        <View>
          <Text style={homeStyles.h2}>Connect</Text>
          <Text style={homeStyles.h2}>Collaborate</Text>
          <Text style={homeStyles.h2}>Create</Text>
        </View>
      </View>
      <Text style={homeStyles.p}>
        Are you a visionary creator ready to showcase your talents and land
        exciting projects? Or a business seeking innovative ideas to elevate
        your brand? You’re in the right place!
      </Text>
      <CustomButton
        title="Get Started"
        onPress={() => navigation.navigate("Register")}
      />
    </SafeAreaView>
  );
};

export default LoggedOutHome;
