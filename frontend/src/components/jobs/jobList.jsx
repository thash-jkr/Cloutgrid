import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "animate.css";

import "./jobs.css";
import NavBar from "../navBar";
import QuestionModal from "./questionModal";

const JobList = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [answers, setAnswers] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/jobs`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [id, showQuestion]);

  const handleApply = async () => {
    if (selectedJob?.questions) {
      setShowQuestion(true);
    } else {
      submitApplication();
    }
  };

  const submitApplication = async () => {
    try {
      const data = {
        answers: answers,
      };

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/${id}/apply/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setShowQuestion(false);
      setAnswers("");
      alert("Application submitted 👌🏻");
      setId(null);
      selectedJob.is_applied = true;
    } catch (error) {
      console.log("Error applying for job", error);
      alert("Something went wrong ⚠️");
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
        <h1 className="animate__animated animate__fadeInDown">
          Apply for Collaborations
        </h1>
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
                  src={`${job.posted_by.user.profile_photo}`}
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
                </div>
                <button
                  className="button-54"
                  onClick={handleApply}
                  disabled={selectedJob.is_applied}
                >
                  {selectedJob.is_applied ? "Applied" : "Apply"}
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
                  <h2>Business Details</h2>
                  <div className="business-details">
                    <Link
                      to={`/profiles/${selectedJob.posted_by.user.username}`}
                    >
                      <button className="button-54">
                        <span>
                          <FontAwesomeIcon icon={faUser} />{" "}
                        </span>
                        Profile
                      </button>
                    </Link>
                    <a href={selectedJob.posted_by.website}>
                      <button className="button-54">
                        <span>
                          <FontAwesomeIcon icon={faGlobe} />{" "}
                        </span>
                        Website
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p>Please select a job to view details</p>
            )}
          </div>
        </div>
      </div>

      {showQuestion && (
        <QuestionModal
          job={selectedJob}
          onClose={() => setShowQuestion(false)}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={submitApplication}
        />
      )}
    </div>
  );
};

export default JobList;
