import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import authStyles from "../styles/auth"; // Assuming you have this style file
import CustomButton from "../components/CustomButton"; // Assuming you have a custom button component

const RegisterBusiness = () => {
  const [formData, setFormData] = useState({
    user: {
      name: "",
      email: "",
      username: "",
      profile_photo: null,
      password: "",
      bio: "",
    },
    website: "",
    target_audience: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    if (name === "website" || name === "target_audience") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [name]: value },
      }));
    }
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, profile_photo: result.uri },
      }));
    }
  };

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleSubmit = async () => {
    if (formData.user.password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please try again.");
      return;
    }

    // Submit logic goes here
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select Target Audience" },
    { value: "art", label: "Art and Photography" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty and Makeup" },
    { value: "business", label: "Business" },
    { value: "diversity", label: "Diversity and Inclusion" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "fashion", label: "Fashion" },
    { value: "finance", label: "Finance" },
    { value: "food", label: "Food and Beverage" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health and Wellness" },
    { value: "home", label: "Home and Gardening" },
    { value: "outdoor", label: "Outdoor and Nature" },
    { value: "parenting", label: "Parenting and Family" },
    { value: "pets", label: "Pets" },
    { value: "sports", label: "Sports and Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "videography", label: "Videography" },
  ];

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.h1}>Join Cloutgrid as a Business</Text>
      <TextInput
        style={authStyles.input}
        placeholder="Name"
        value={formData.user.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Email"
        value={formData.user.email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Username"
        value={formData.user.username}
        onChangeText={(value) => handleChange("username", value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Bio"
        value={formData.user.bio}
        onChangeText={(value) => handleChange("bio", value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.user.password}
        onChangeText={(value) => handleChange("password", value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={handleConfirmPassword}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Website"
        value={formData.website}
        onChangeText={(value) => handleChange("website", value)}
      />
      <View>
        <TouchableOpacity onPress={handleFileChange}>
          <Text style={authStyles.input}>Select Profile Photo</Text>
        </TouchableOpacity>
        {formData.user.profile_photo && (
          <Image
            source={{ uri: formData.user.profile_photo }}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        )}
      </View>
      <View style={authStyles.input}>
        <Picker
          selectedValue={formData.target_audience}
          style={authStyles.picker}
          onValueChange={(value) => handleChange("target_audience", value)}
        >
          {AREA_OPTIONS.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      <CustomButton title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default RegisterBusiness;
