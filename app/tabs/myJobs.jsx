import { View, Text, Image } from "react-native";
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

const MyJobs = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const modalizeRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(
          `http://192.168.1.106:8001/jobs/my-jobs/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setJobs(response.data);
        if (response.data.length > 0) {
          setId(response.data[0].id);
          setSelectedJob(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

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
          `http://192.168.1.106:8001/jobs/my-jobs/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setApplicants(response.data);
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

  return (
    <SafeAreaView style={jobsStyles.container}>
      <Text style={jobsStyles.h1}>My Jobs</Text>
      <ScrollView style={jobsStyles.jobs}>
        {jobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={jobsStyles.job}
            onPress={() => handleSelectJob(job)}
          >
            <Image
              source={{
                uri: `http:192.168.1.106:8001${job.posted_by.user.profile_photo}`,
              }}
              style={jobsStyles.jobImage}
            />
            <View>
              <Text style={jobsStyles.h2}>{job.title}</Text>
              <Text>Number of applicants: {job.applicants.length}</Text>
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
            <TouchableOpacity
              style={jobsStyles.jobDelete}
              onPress={() => console.log("Delete Job pressed")}
            >
              <FontAwesomeIcon icon={faTrashCan} style={jobsStyles.deleteIcon} />
            </TouchableOpacity>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <TouchableOpacity
                  key={applicant.id}
                  style={jobsStyles.job}
                  onPress={() => {
                    navigation.navigate("Profiles", {
                      username: applicant.user.username,
                    });
                  }}
                >
                  <Image
                    source={{
                      uri: `http://192.168.1.106:8001${applicant.user.profile_photo}`,
                    }}
                    style={jobsStyles.jobImage}
                  />
                  <View>
                    <Text>{applicant.user.name}</Text>
                    <Text>{applicant.area}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No applicants yet.</Text>
            )}
          </View>
        ) : null}
      </Modalize>
    </SafeAreaView>
  );
};

export default MyJobs;
