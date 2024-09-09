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

  // Date picker handler
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    handleChange("date_of_birth", formattedDate); // Update formData with formatted date
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

  const handleSubmit = () => {
    // Handle form submission logic here
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

      <View style={{ marginVertical: 10 }}>
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

      <View style={{ marginVertical: 10 }}>
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
            onChange={onChange}
          />
        )}
      </View>

      <View style={authStyles.picker}>
        <Picker
          selectedValue={formData.area}
          style={authStyles.input}
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
