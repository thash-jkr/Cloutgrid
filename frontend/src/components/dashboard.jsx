import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBriefcase,
  faCommentDots,
  faLink,
  faPeopleArrows,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "./navBar";
import { getCSRFToken } from "../getCSRFToken";

const Dashboard = () => {
  const [user, setUser] = useState("");
  const [type, setType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          setUser(response.data);
        }
      } catch (e) {
        console.log("Error found", e);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    const fetchType = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user-type`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setType(response.data.type);
      } catch (error) {
        console.log("Error fetching user type", error);
      }
    };

    fetchType();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/notifications/?all=${showAll}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [showAll]);

  useEffect(() => {
    const fetchJobs = async () => {
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

    fetchJobs();
  }, []);

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
          const shuffled = [...arr]; // Create a copy to avoid mutation
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled.slice(0, count);
        };

        const filterAndPushSuggestions = (allItems, sugItems, condition) => {
          for (let item of allItems) {
            if (item.user.username !== user.username && condition(item)) {
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

        // Filtering creators based on the type
        filterAndPushSuggestions(all_creators, sug_creators, (creator) => {
          if (type === "creator" && creator.area === user.area) {
            return true;
          } else if (
            type === "business" &&
            creator.area === user.target_audience
          ) {
            return true;
          }
          return false;
        });

        // Filtering businesses based on the type
        filterAndPushSuggestions(all_businesses, sug_businesses, (business) => {
          if (type === "creator" && business.target_audience === user.area) {
            return true;
          } else if (
            type === "business" &&
            business.target_audience === user.target_audience
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
  }, [user, type]);

  const handleClose = async (id) => {
    try {
      const accessToken = localStorage.getItem("access");
      const csrfToken = getCSRFToken();
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
          },
        }
      );
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="home loggedin-home">
        <div className="home-card-container">
          <div className="home-card card-4">
            <h1>
              Notifications{" "}
              <span>
                <FontAwesomeIcon icon={faBell} />
              </span>
            </h1>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="toggleSwitch"
                checked={showAll}
                onChange={() => setShowAll(!showAll)}
              />
              <label htmlFor="toggleSwitch">Show All</label>
            </div>
            <div className="notification-main">
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <div
                        className="notification-container"
                        onClick={() => handleClose(notification.id)}
                      >
                        <p>{notification.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications found</p>
              )}
            </div>
          </div>
          <div className="home-card card-5">
            <h1>
              Quick Links{" "}
              <span>
                <FontAwesomeIcon icon={faLink} />
              </span>
            </h1>
            <div className="card-5-links">
              <Link to={"/profile"}>View Your Profile</Link>
              {type === "creator" && (
                <>
                  <Link to={"/jobs"}>Find Collaborations</Link>
                </>
              )}
              {type === "business" && (
                <>
                  <Link to={"/job/create"}>Create a new Job</Link>
                  <Link to={"/my-jobs"}>View Your Created Jobs</Link>
                </>
              )}
            </div>
          </div>
          <div className="home-card card-6">
            {type === "creator" ? (
              <h1>
                Recent Jobs{" "}
                <span>
                  <FontAwesomeIcon icon={faBriefcase} />
                </span>
              </h1>
            ) : (
              <h1>
                Recent Applicants{" "}
                <span>
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </h1>
            )}
            {type === "creator" && (
              <div className="home-jobs">
                {jobs.map((job) => {
                  return (
                    <div key={job.id} className="home-job">
                      <h3>{job.title}</h3>
                      <p>{job.posted_by.user.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
            {type === "business" && (
              <div>
                {applicants.length > 0 ? (
                  <div>
                    {applicants.map((applicant) => (
                      <div
                        key={applicant.user.username}
                        className="home-applicant"
                      >
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}${applicant.user.profile_photo}`}
                          alt="Profile"
                        />
                        <Link to={`/profiles/${applicant.user.username}`}>
                          <h3>{applicant.user.name}</h3>
                        </Link>
                        <p>{applicant.area}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No new applicants yet.</p>
                )}
              </div>
            )}
          </div>
          <div className="home-card card-1">
            <h1>
              Suggestions{" "}
              <span>
                <FontAwesomeIcon icon={faPeopleArrows} />
              </span>
            </h1>
            <div className="home-suggestions">
              {suggestions.map((suggestion) => (
                <div key={suggestion.user.username} className="home-suggestion">
                  <div className="suggestion-container">
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${suggestion.user.profile_photo}`}
                      alt="Profile"
                    />
                    <Link to={`/profiles/${suggestion.user.username}`}>
                      <h3>{suggestion.user.name}</h3>
                    </Link>
                  </div>
                  {suggestion.area ? (
                    <p>{suggestion.area}</p>
                  ) : (
                    <p>{suggestion.target_audience}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="home-card card-2">
            <h1>
              Feedbacks{" "}
              <span>
                <FontAwesomeIcon icon={faCommentDots} />
              </span>
            </h1>
            <textarea
              type="text"
              placeholder="Please give us your valuable feedback"
            />
            <button className="button-54">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
