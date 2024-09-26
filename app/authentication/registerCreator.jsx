import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";
import axios from "axios";

const RegisterCreator = () => {
  const [formData, setFormData] = useState({
    user: {
      name: "",
      email: "",
      username: "",
      profile_photo: null,
      password: "",
      bio: "",
    },
    date_of_birth: "",
    area: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    const formattedDate = currentDate.toISOString().split("T")[0];
    handleChange("date_of_birth", formattedDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleChange = (name, value) => {
    if (name === "date_of_birth" || name === "area") {
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

    // console.log(result.assets[0]["uri"]);

    if (!result.canceled) {
      const localUri = result.assets[0]["uri"];
      console.log(localUri);
      const fileName = localUri.split("/").pop();
      console.log(fileName);
      const match = /\.(\w+)$/.exec(fileName);
      console.log(match);
      const fileType = match ? `image/${match[1]}` : `image`;
      console.log(fileType);

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error("Failed to load image"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", localUri, true);
        xhr.send(null);
      });

      setFormData((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          profile_photo: {
            uri: localUri,
            name: fileName,
            type: fileType,
            file: blob,
          },
        },
      }));
    }
  };

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleSubmit = async () => {
    try {
      if (formData.user.password !== confirmPassword) {
        Alert.alert("Passwords do not match", "Please try again.");
        return;
      }

      const data = new FormData();
      data.append("user.name", formData.user.name);
      data.append("user.email", formData.user.email);
      data.append("user.username", formData.user.username);
      data.append("user.password", formData.user.password);
      data.append("user.bio", formData.user.bio);
      data.append("date_of_birth", formData.date_of_birth);
      data.append("area", formData.area);

      if (formData.user.profile_photo) {
        data.append("user.profile_photo", {
          uri: formData.user.profile_photo.uri,
          name: formData.user.profile_photo.name,
          type: formData.user.profile_photo.type,
        });
      }

      const response = await axios.post(
        "http://192.168.1.106:8001/register/creator/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert(
        "Registration Successful",
        "You have successfully registered."
      );
      // navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error: ", error);
    }
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select Area" },
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
      <Text style={authStyles.h1}>Join Cloutgrid</Text>

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
        secureTextEntry={true}
        value={formData.user.password}
        onChangeText={(value) => handleChange("password", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(value) => handleConfirmPassword(value)}
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

      <View>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={authStyles.input}>
            Select Date of Birth: {formData.date_of_birth}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={authStyles.input}>
        <Picker
          selectedValue={formData.area}
          style={authStyles.picker}
          onValueChange={(value) => handleChange("area", value)}
        >
          {AREA_OPTIONS.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      <CustomButton title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default RegisterCreator;
