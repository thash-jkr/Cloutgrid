import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import bg from "../assets/—Pngtree—blogger review concept vetor creative_7689749 (1).png";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import "animate.css";
import NavBar from "./navBar";
import { getCSRFToken } from "../getCSRFToken";

const LoggedOutHome = () => {
  return (
    <div className="home">
      <div className="home-flex">
        <div className="home-flex-left">
          <div className="home-about">
            <h1>Marketplace for Influencers and Brands</h1>
            <h2>Connect</h2>
            <h2>Collaborate</h2>
            <h2>Create</h2>
            <p>
              Are you a visionary creator ready to showcase your talents and
              land exciting projects? Or a business seeking innovative ideas to
              elevate your brand? You’re in the right place!
            </p>
            <Link to="/register">
              <button className="button-54">Get Started</button>
            </Link>
          </div>
        </div>
        <div className="home-flex-right">
          <img src={bg} alt="image" />
        </div>
      </div>
      <footer>
        <div className="footer">
          <div className="row footer-icons-row">
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>

          <div className="row footer-links">
            <ul>
              <li>
                <a href="/">Contact us</a>
              </li>
              <li>
                <a href="/">Our Services</a>
              </li>
              <li>
                <a href="/">Privacy Policy</a>
              </li>
              <li>
                <a href="/">Terms & Conditions</a>
              </li>
              <li>
                <a href="/">Career</a>
              </li>
            </ul>
          </div>

          <div className="row">
            Cloutgrid Copyright © 2024 Cloutgrid - All rights reserved ||
            Designed By: thash_jkr
          </div>
        </div>
      </footer>
    </div>
  );
};

const LoggedInHome = () => {
  const [user, setUser] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data) {
          setUser(data.user.name);
        }
      } catch (e) {
        console.log("Error found", e);
      }
    })();
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
        console.log("Notifications:", response.data);
      } catch (error) {
        setError("Error fetching notifications");
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
        console.log(sortedJobs.slice(0, 5));
      } catch (error) {
        setError("Error fetching jobs");
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
          setError("Error fetching jobs or applicants");
          console.error("Error fetching jobs or applicants:", error);
        }
      };

      fetchLatestJobAndApplicants();
    }
  }, [type]);

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
    <div className="home loggedin-home">
      <h1>Welcome {user}</h1>
      <div className="home-card-container">
        <div className="home-card card-4">
          <h1>Notifications</h1>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="toggleSwitch"
              checked={showAll}
              onChange={() => setShowAll(!showAll)}
            />
            <label htmlFor="toggleSwitch">Show All</label>
          </div>
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
        <div className="home-card card-5">
          <h1>Quick Links</h1>
          <div className="card-5-links">
            <Link to={"/profile"}>View Your Profile</Link>
            {type === "creator" && (
              <>
                <Link to={"/jobs"}>Jobs</Link>
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
          {type === "creator" && (
            <div>
              <h1>Recent Jobs</h1>
              <div>
                {jobs.map((job) => {
                  return (
                    <div key={job.id} className="home-job">
                      <h3>{job.title}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {type === "business" && (
            <div>
              <h1>New Applicants</h1>
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
        <div className="home-card">Card 1</div>
        <div className="home-card">Card 2</div>
        <div className="home-card">Card 3</div>
      </div>
    </div>
  );
};

const Home = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access")) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <>
      <NavBar />
      {auth ? <LoggedInHome /> : <LoggedOutHome />}
    </>
  );
};

export default Home;
