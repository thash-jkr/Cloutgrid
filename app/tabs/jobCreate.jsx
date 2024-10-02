import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import React, { useState } from "react";
import jobsStyles from "../styles/jobs";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

const JobCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company_website: "",
    medium: "",
    due_date: "",
    requirements: "",
    questions: "",
    target_creator: "",
  });
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showMediumModal, setShowMediumModal] = useState(false);
  const navigation = useNavigation();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    handleChange("due_date", currentDate.toISOString().split("T")[0]);
  };

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `http://192.168.1.106:8001/jobs/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Job post created successfully!");
        setFormData({
          title: "",
          description: "",
          company_website: "",
          medium: "",
          due_date: "",
          requirements: "",
          questions: "",
          target_creator: "",
        });
        navigation.navigate("MyJobs");
      }
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const MEDIUM_CHOICES = [
    { value: "", label: "Select a medium" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "Youtube" },
  ];

  const AREA_CHOICES = [
    { value: "", label: "Select your target audience" },
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
    <View style={jobsStyles.container}>
      <Text style={jobsStyles.h1}>Create a Collaboration</Text>
      <TextInput
        style={jobsStyles.input}
        placeholder="Title"
        value={formData.title}
        onChangeText={(value) => handleChange("title", value)}
      />
      <TextInput
        style={jobsStyles.input}
        placeholder="Description"
        value={formData.description}
        onChangeText={(value) => handleChange("description", value)}
      />
      <TextInput
        style={jobsStyles.input}
        placeholder="Company Website"
        value={formData.company_website}
        onChangeText={(value) => handleChange("company_website", value)}
      />
      <TouchableOpacity
        style={jobsStyles.input}
        onPress={() => setShowMediumModal(true)}
      >
        <Text>Medium: {formData.medium}</Text>
      </TouchableOpacity>
      <View style={jobsStyles.input}>
        <TouchableOpacity onPress={showDatepicker}>
          <Text>Select Due Date: {formData.due_date}</Text>
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
      <TextInput
        style={jobsStyles.input}
        placeholder="Requirements"
        value={formData.requirements}
        onChangeText={(value) => handleChange("requirements", value)}
      />
      <TextInput
        style={jobsStyles.input}
        placeholder="Questions"
        value={formData.questions}
        onChangeText={(value) => handleChange("questions", value)}
      />
      <TouchableOpacity
        style={jobsStyles.input}
        onPress={() => setShowAreaModal(true)}
      >
        <Text>Target Audience: {formData.target_creator}</Text>
      </TouchableOpacity>

      <Modal visible={showMediumModal} transparent={true} animationType="slide">
        <View style={jobsStyles.modalContainer}>
          <View style={jobsStyles.modalContent}>
            <Text style={jobsStyles.modalTitle}>Select a medium</Text>
            <Picker
              selectedValue={formData.medium}
              style={jobsStyles.picker}
              onValueChange={(value) => {
                handleChange("medium", value);
              }}
            >
              {MEDIUM_CHOICES.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
            <CustomButton title="Close" onPress={() => setShowMediumModal(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={showAreaModal} transparent={true} animationType="slide">
        <View style={jobsStyles.modalContainer}>
          <View style={jobsStyles.modalContent}>
            <Text style={jobsStyles.modalTitle}>Select your target audience</Text>
            <Picker
              selectedValue={formData.target_creator}
              style={jobsStyles.picker}
              onValueChange={(value) => {
                handleChange("target_creator", value);
              }}
            >
              {AREA_CHOICES.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
            <CustomButton title="Close" onPress={() => setShowAreaModal(false)} />
          </View>
        </View>
      </Modal>
      <CustomButton title="Create Job" onPress={handleSubmit} />
    </View>
  );
};

export default JobCreate;
