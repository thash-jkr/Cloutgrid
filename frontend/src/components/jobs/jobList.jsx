import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSolid, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./jobs.css";
import NavBar from "../navBar";

const JobList = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get("http://192.168.1.106:8000/jobs", {
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
      try {
        const response = await axios.get(
          `http://192.168.1.106:8000/jobs/${id}/status/`
        );
        setApplied(response.data.is_applied);
      } catch (error) {
        console.error("Error fetching job status:", error);
      }
    };

    fetchJobs();
    checkApplied();
  }, [id, applied]);

  const handleApply = async () => {
    try {
      const response = await axios.post(
        `http://192.168.1.106:8000/jobs/${id}/apply/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setApplied(true);
      console.log("Applied successfully:", response.data);
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

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

  return (
    <div>
      <NavBar />
      <div className="job-main">
        <h1>Apply for Collaborations</h1>
        <div className="job-container">
          <div className="job-listing">
            {jobs.map((job) => (
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
                  <p>{job.posted_by.user.name}</p>
                </div>
              </div>
            ))}
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
            {selectedJob ? (
              <div>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="close-icon"
                  onClick={closePopup}
                />
                <h1>{selectedJob.title}</h1>
                <div className="job-subtitle">
                  <p>
                    <strong>Posted by:</strong>{" "}
                    {selectedJob.posted_by.user.name}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {selectedJob.due_date}
                  </p>
                  <p>
                    <strong>Medium:</strong> {selectedJob.medium.toUpperCase()}
                  </p>
                </div>
                <button
                  className="button-54"
                  onClick={handleApply}
                  disabled={applied}
                >
                  {applied ? "Applied" : "Apply"}
                </button>
                <div className="job-detail-desc">
                  <h2>Job Description</h2>
                  <p>{selectedJob.description}</p>
                  <h2>Requirements</h2>
                  <ul>
                    {selectedJob.requirements.split(",").map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                  <h2>Company Details</h2>
                  <p>{selectedJob.posted_by.user.name}</p>
                </div>
                <button className="button-54" onClick={closePopup}>
                  Close
                </button>
              </div>
            ) : (
              <p>Please select a job to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
