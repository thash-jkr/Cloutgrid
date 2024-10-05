import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import authStyles from "../styles/auth";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const navigation = useNavigation();
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
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0]["uri"];
      const fileName = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

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

      await axios.post("http://192.168.1.106:8001/register/creator/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Registration Successful",
        "You have successfully registered."
      );
      navigation.navigate("Login");
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
      <Text style={authStyles.h1}>Join Cloutgrid as a Creator</Text>

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

      <View style={authStyles.input}>
        <TouchableOpacity onPress={handleFileChange}>
          <Text>Select Profile Photo</Text>
        </TouchableOpacity>
        <View style={{
          marginLeft: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}>
          {formData.user.profile_photo && (
            <FontAwesomeIcon icon={faCheck} color="green" size={20} />
          )}
        </View>
      </View>

      <View style={authStyles.input}>
        <TouchableOpacity onPress={showDatepicker}>
          <Text>Select Date of Birth: {formData.date_of_birth}</Text>
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

      <TouchableOpacity
        onPress={() => setShowAreaModal(true)}
        style={authStyles.input}
      >
        <Text>{formData.area ? formData.area : "Select your target area"}</Text>
      </TouchableOpacity>

      <Modal visible={showAreaModal} transparent={true} animationType="slide">
        <View style={authStyles.modalOverlay}>
          <View style={authStyles.modalContainer}>
            <Text style={authStyles.h2}>Select your target area</Text>
            <Picker
              selectedValue={formData.area}
              style={authStyles.picker}
              onValueChange={(value) => {
                handleChange("area", value);
              }}
            >
              {AREA_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
            <CustomButton
              title="Close"
              onPress={() => setShowAreaModal(false)}
            />
          </View>
        </View>
      </Modal>
      <CustomButton title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default RegisterCreator;
