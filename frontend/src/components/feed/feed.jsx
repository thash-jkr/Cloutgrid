import React, { useState, useEffect } from "react";
import axios from "axios";

import LeftColumn from "./feedLeft";
import MiddleColumn from "./feedMiddle";
import RightColumn from "./feedRight";
import "./feed.css";
import NavBar from "../navBar";

const Feed = () => {
  const [type, setType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [userData, setUserData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data) {
          setUserData(response.data);
          setType(response.data.area ? "creator" : "business");
        }
      } catch (e) {
        console.log("Error found", e);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/users/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const all_creators = response.data.creators;
        const all_businesses = response.data.businesses;
        const sug_creators = [];
        const sug_businesses = [];
        const sug_final = [];

        const getRandomElements = (arr, count) => {
          const shuffled = [...arr];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled.slice(0, count);
        };

        const filterAndPushSuggestions = (allItems, sugItems, condition) => {
          for (let item of allItems) {
            if (item.user.username !== userData.username && condition(item)) {
              sugItems.push(item);
            }
          }

          if (sugItems.length === 0) {
            if (allItems.length <= 3) {
              sug_final.push(...allItems);
            } else {
              sug_final.push(...getRandomElements(allItems, 3));
            }
          } else {
            if (sugItems.length <= 3) {
              sug_final.push(...sugItems);
            } else {
              sug_final.push(...getRandomElements(sugItems, 3));
            }
          }
        };

        filterAndPushSuggestions(all_creators, sug_creators, (creator) => {
          if (type === "creator" && creator.area === userData.area) {
            return true;
          } else if (
            type === "business" &&
            creator.area === userData.target_audience
          ) {
            return true;
          }
          return false;
        });

        filterAndPushSuggestions(all_businesses, sug_businesses, (business) => {
          if (
            type === "creator" &&
            business.target_audience === userData.area
          ) {
            return true;
          } else if (
            type === "business" &&
            business.target_audience === userData.target_audience
          ) {
            return true;
          }
          return false;
        });

        setSuggestions(sug_final);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userData, type]);

  useEffect(() => {
    if (type === "creator") {
      const fetchLatestJobs = async () => {
        try {
          const accessToken = localStorage.getItem("access");
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/jobs/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const sortedJobs = response.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          setJobs(sortedJobs.slice(0, 3));
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      };
      fetchLatestJobs();
    }
  }, [type]);

  useEffect(() => {
    if (type === "business") {
      const fetchLatestJobAndApplicants = async () => {
        try {
          const accessToken = localStorage.getItem("access");
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const alljobs = response.data;

          for (let job of alljobs) {
            const applicantsResponse = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/${job.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const applicants = applicantsResponse.data;
            if (applicants.length > 0) {
              setApplicants(applicants);
              break;
            }
          }
        } catch (error) {
          console.error("Error fetching jobs or applicants:", error);
        }
      };

      fetchLatestJobAndApplicants();
    }
  }, [type]);

  return (
    <div style={{backgroundColor: "#f5faff"}}>
      <NavBar />
      <div className="container">
        <div className="left">
          <LeftColumn userData={userData} />
        </div>
        <div className="middle">
          <MiddleColumn type={type} />
        </div>
        <div className="right">
          <RightColumn
            suggestions={suggestions}
            applicants={applicants}
            jobs={jobs}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;
