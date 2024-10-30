import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getCSRFToken } from "../getCSRFToken";
import jobsStyles from "../styles/jobs";
import { Modalize } from "react-native-modalize";
import CustomButton from "../components/CustomButton";

import Config from "../config";

const JobList = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [answers, setAnswers] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);

  const modalizeRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(`${Config.BASE_URL}/jobs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [id]);

  const handleApply = async () => {
    if (selectedJob?.questions) {
      setShowQuestion(true);
    } else {
      submitApplication();
    }
  };

  const submitApplication = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const csrfToken = await getCSRFToken();
      const data = {
        answers: answers,
      };

      await axios.post(`http://192.168.1.106:8001/jobs/${id}/apply/`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": csrfToken,
        },
      });

      setShowQuestion(false);
      setAnswers("");
      Alert.alert("Application Successful", "You have applied for the job.");
      modalizeRef.current?.close();
      setId(null);
    } catch (error) {
      console.error("Error applying for job:", error);
      Alert.alert("Error", "There was an error applying for the job.");
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    modalizeRef.current?.open();
  };

  return (
    <SafeAreaView style={jobsStyles.container}>
      <Text style={jobsStyles.h1}>Apply for Collaborations</Text>
      <ScrollView style={jobsStyles.jobs}>
        {jobs &&
          jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={jobsStyles.job}
              onPress={() => handleSelectJob(job)}
            >
              <Image
                source={{
                  uri: `${job.posted_by.user.profile_photo}`,
                }}
                style={jobsStyles.jobImage}
              />
              <View>
                <Text style={jobsStyles.h2}>{job.title}</Text>
                <Text>{job.posted_by.user.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        HeaderComponent={
          <View style={jobsStyles.modalHeader}>
            <Text style={jobsStyles.headerText}>Job Details</Text>
          </View>
        }
      >
        {selectedJob ? (
          <View style={jobsStyles.modal}>
            <Text style={jobsStyles.h1}>{selectedJob.title}</Text>
            <View style={jobsStyles.jobDetail}>
              <Text>
                <Text style={jobsStyles.jobDetailText}>
                  Posted by: {selectedJob.posted_by.user.name}
                </Text>
              </Text>
              <Text>
                <Text style={jobsStyles.jobDetailText}>
                  Due Date: {selectedJob.due_date}
                </Text>
              </Text>
              <Text>
                <Text style={jobsStyles.jobDetailText}>
                  Medium: {selectedJob.medium.toUpperCase()}
                </Text>
              </Text>
            </View>
            <Text style={jobsStyles.jobData}>Job Description:</Text>
            <Text>{selectedJob.description}</Text>
            <Text style={jobsStyles.jobData}>Requirements:</Text>
            <View>
              {selectedJob.requirements.split(",").map((req, index) => (
                <Text key={index}>• {req}</Text>
              ))}
            </View>
            <View style={jobsStyles.button}>
              <CustomButton
                title={selectedJob.is_applied ? "Applied" : "Apply"}
                onPress={handleApply}
                disabled={selectedJob.is_applied}
              />
            </View>
          </View>
        ) : (
          <Text>Please select a job to view details.</Text>
        )}
      </Modalize>

      <Modal visible={showQuestion} transparent={true} animationType="slide">
        <View style={jobsStyles.modalContainer}>
          <View style={jobsStyles.modalContent}>
            <ScrollView>
              <Text style={jobsStyles.modalTitle}>
                {selectedJob?.questions ? selectedJob.questions : ""}
              </Text>
            </ScrollView>
            <TextInput
              style={jobsStyles.input}
              placeholder="Give your answer here...!"
              value={answers}
              onChangeText={(value) => setAnswers(value)}
            />
            <View style={{ flexDirection: "row" }}>
              <CustomButton title="Submit Answer" onPress={submitApplication} />
              <CustomButton
                title="Cancel"
                onPress={() => setShowQuestion(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default JobList;
