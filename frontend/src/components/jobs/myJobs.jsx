import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./jobs.css";
import NavBar from "../navBar";
import { getCSRFToken } from "../../getCSRFToken";
import AnswerModal from "./answerModal";

const MyJobs = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/`,
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
      } catch (error) {
        setError("Error fetching jobs");
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!id) {
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setApplications(response.data);
      } catch (error) {
        setError("Error fetching applicants");
      }
    };

    fetchApplications();
  }, [id]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    document.body.style.overflow = "hidden";
  };

  const handleSelect = () => {
    if (selectedJob?.questionns) {
      setShowAnswer(true)
    } else {
      
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/jobs/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "X-CSRFToken": getCSRFToken(),
        },
      });

      setJobs(jobs.filter((job) => job.id !== id));
      closePopup();
    } catch (error) {
      console.log(error);
      setError("Error deleting job. Please try again.");
    }
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
                    src={`${process.env.REACT_APP_API_BASE_URL}${job.posted_by.user.profile_photo}`}
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
              <div className="job-description-container">
                <FontAwesomeIcon
                  icon={faXmark}
                  className="close-icon"
                  onClick={closePopup}
                />
                <h1>Applicants</h1>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="trash-icon"
                  onClick={handleDelete}
                />
                {applications.length === 0 ? (
                  <p>No applicants yet.</p>
                ) : (
                  applications.map((application) => (
                    <Link
                      to={`/profiles/${application.creator.user.username}`}
                      className="job-a"
                      key={application.creator.user.username}
                    >
                      <div
                        key={application.creator.user.username}
                        className="job-applicant"
                      >
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}${application.creator.user.profile_photo}`}
                          alt="Profile"
                          className="profile-logo"
                        />
                        <div>
                          <h2>{application.creator.user.name}</h2>
                          <p>Category: {application.creator.area}</p>
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

      {showAnswer && (
        <AnswerModal />
      )}
    </div>
  );
};

export default MyJobs;
