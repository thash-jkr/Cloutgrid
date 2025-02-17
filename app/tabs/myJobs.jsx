import { View, Text, Image, Modal, RefreshControl } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import jobsStyles from "../styles/jobs";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native";
import { Modalize } from "react-native-modalize";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import CustomButton from "../common/CustomButton";
import Config from "../config";

const MyJobs = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showApplicant, setShowApplicant] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [applicantAnswers, setApplicantAnswers] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const modalizeRef = useRef(null);
  const navigation = useNavigation();

  const fetchJobs = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.get(`${Config.BASE_URL}/jobs/my-jobs/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setJobs(response.data);
      if (response.data.length > 0) {
        setId(response.data[0].id);
        setSelectedJob(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        if (!id) {
          return;
        }
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(
          `${Config.BASE_URL}/jobs/my-jobs/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [id]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    modalizeRef.current?.open();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={jobsStyles.container}>
      <Text style={jobsStyles.h1}>Your Jobs</Text>
      <ScrollView
        style={jobsStyles.jobs}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      >
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={jobsStyles.job}
              onPress={() => handleSelectJob(job)}
            >
              <Image
                source={{
                  uri: `${Config.BASE_URL}${job.posted_by.user.profile_photo}`,
                }}
                style={jobsStyles.jobImage}
              />
              <View>
                <Text style={jobsStyles.h2}>{job.title}</Text>
                <Text>Due: {job.due_date}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={jobsStyles.h2}>No jobs posted yet.</Text>
        )}
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        snapPoint={400}
        onClose={() => setSelectedJob(null)}
        HeaderComponent={
          <View style={jobsStyles.modalHeader}>
            <Text style={jobsStyles.headerText}>Job Applicants</Text>
          </View>
        }
      >
        {selectedJob ? (
          <View style={jobsStyles.modal}>
            <Text style={jobsStyles.h1}>{selectedJob.title}</Text>
            <TouchableOpacity
              style={jobsStyles.jobDelete}
              onPress={() => console.log("Delete Job pressed")}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                style={jobsStyles.deleteIcon}
              />
            </TouchableOpacity>
            {applications.length > 0 ? (
              applications.map((application) => (
                <TouchableOpacity
                  key={application.id}
                  style={jobsStyles.job}
                  onPress={() => {
                    setApplicant(application.creator);
                    setApplicantAnswers(application.answers);
                    setShowApplicant(true);
                  }}
                >
                  <Image
                    source={{
                      uri: `${Config.BASE_URL}${application.creator.user.profile_photo}`,
                    }}
                    style={jobsStyles.jobImage}
                  />
                  <View>
                    <Text>{application.creator.user.name}</Text>
                    <Text>{application.creator.area}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No applicants yet.</Text>
            )}
          </View>
        ) : null}
      </Modalize>

      <Modal visible={showApplicant} transparent={true} animationType="slide">
        <View style={jobsStyles.modalContainer}>
          <View style={jobsStyles.modalContent}>
            <Text style={jobsStyles.modalTitle}>
              {selectedJob?.questions ? selectedJob.questions : ""}
            </Text>
            <Text>
              Applicant answers:{" "}
              {applicantAnswers ? applicantAnswers : "No answers provided."}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <CustomButton
                title="View Profile"
                onPress={() => {
                  setShowApplicant(false);
                  navigation.navigate("Profiles", {
                    username: applicant.user.username,
                  });
                }}
              />
              <CustomButton
                title="Cancel"
                onPress={() => setShowApplicant(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MyJobs;
