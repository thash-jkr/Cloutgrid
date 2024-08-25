import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSolid, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./jobs.css";
import NavBar from "../navBar";

const MyJobs = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.106:8000/jobs/my-jobs/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setJobs(response.data);
        if (response.data.length > 0) {
          setId(response.data[0].id);
          setSelectedJob(response.data[0]);
        }
        console.log("Jobs:", response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Error fetching jobs");
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
        const response = await axios.get(
          `http://192.168.1.106:8000/jobs/my-jobs/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setApplicants(response.data);
        console.log("Applicants:", response.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setError("Error fetching applicants");
      }
    };

    fetchApplicants();
  }, [id]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setSelectedJob(null);
    setId(null);
    document.body.style.overflow = "auto";
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="job-main">
        <h1>My Posted Jobs</h1>
        <div className="job-container">
          <div className="job-listing">
            {jobs.length === 0 ? (
              <p>No jobs posted yet.</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className={`job-listing-item ${
                    selectedJob?.id === job.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectJob(job)}
                >
                  <img
                    src={`http://192.168.1.106:8000${job.posted_by.user.profile_photo}`}
                    alt="Company Logo"
                    className="profile-logo"
                  />
                  <div className="job-listing-info">
                    <h3>{job.title}</h3>
                    <p>Due: {job.due_date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div
            className={`backdrop ${selectedJob ? "show" : ""}`}
            onClick={closePopup}
          ></div>
          <div
            className={`job-details job-detail-popup ${
              selectedJob ? "show" : ""
            }`}
          >
            {selectedJob && (
              <div>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="close-icon"
                  onClick={closePopup}
                />
                <h1>Applicants</h1>
                {applicants.length === 0 ? (
                  <p>No applicants yet.</p>
                ) : (
                  applicants.map((applicant) => (
                    <Link
                      to={`/profiles/${applicant.user.username}`}
                      className="job-a"
                    >
                      <div
                        key={applicant.user.username}
                        className="job-applicant"
                      >
                        <img
                          src={`http://192.168.1.106:8000${applicant.user.profile_photo}`}
                          alt="Profile"
                          className="profile-logo"
                        />
                        <div>
                          <h2>{applicant.user.name}</h2>
                          <p>Category: {applicant.area}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
