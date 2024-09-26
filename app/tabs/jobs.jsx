import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getCSRFToken } from "../getCSRFToken";
import jobsStyles from "../styles/jobs";
import { Modalize } from "react-native-modalize";
import CustomButton from "../components/CustomButton";

const JobList = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const modalizeRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get("http://192.168.1.106:8001/jobs", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const checkApplied = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://192.168.1.106:8001/jobs/${id}/status/`
          );
          setApplied(response.data.is_applied);
        } catch (error) {
          console.error("Error fetching job status:", error);
        }
      }
    };

    fetchJobs();
    checkApplied();
  }, [id, applied]);

  const handleApply = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const csrfToken = await getCSRFToken();

      await axios.post(
        `http://192.168.1.106:8001/jobs/${id}/apply/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
          },
        }
      );
      setApplied(true);
      Alert.alert("Application Successful", "You have applied for the job.");
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
        {jobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={jobsStyles.job}
            onPress={() => handleSelectJob(job)}
          >
            <Image
              source={{
                uri: `http://192.168.1.106:8001${job.posted_by.user.profile_photo}`,
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
        snapPoint={400}
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
                title={applied ? "Applied" : "Apply"}
                onPress={handleApply}
                disabled={applied}
              />
            </View>
          </View>
        ) : (
          <Text>Please select a job to view details.</Text>
        )}
      </Modalize>
    </SafeAreaView>
  );
};

export default JobList;
