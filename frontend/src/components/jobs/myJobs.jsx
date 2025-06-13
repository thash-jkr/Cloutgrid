import "xlsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./jobs.css";
import NavBar from "../navBar";
import { getCSRFToken } from "../../getCSRFToken";
import AnswerModal from "./answerModal";

const MyJobs = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();

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
        alert("Something went wrong");
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
        alert("Error fetching applicants");
      }
    };

    fetchApplications();
  }, [id]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    document.body.style.overflow = "hidden";
  };

  const handleSelect = (username) => {
    if (selectedJob?.questions.length > 0) {
      setQuestions(selectedJob.questions);
      setShowAnswer(true);
    } else {
      navigate(`/profiles/${username}/`);
    }
  };

  const handleDownload = () => {
    const data = [];
    let i = 1;
    for (const obj of applications) {
      let details = {
        id: i,
        application_id: obj.id,
        creator_name: obj.creator.user.name,
        creator_username: obj.creator.user.username,
        creator_email: obj.creator.user.email,
        creator_category: obj.creator.area,
      };

      for (const q in obj.job.questions) {
        details = {
          ...details,
          [`Question ${q}: ${obj.job.questions[q].content}`]:
            obj.answers[q].content,
        };
      }
      data.push(details);
      i++;
    }

    const xlsx = require("xlsx");
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, "data.xlsx");
  };

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
      alert("Error deleting job. Please try again.");
    }
  };

  const closePopup = () => {
    setSelectedJob(null);
    setId(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div style={{height: "100vh"}}>
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
                <div style={{ margin: "10px" }}>
                  <button
                    className="button-54"
                    disabled={applications.length === 0}
                    onClick={handleDownload}
                  >
                    Download Data
                  </button>
                  <button className="button-54" onClick={handleDelete}>
                    Delete Job
                  </button>
                </div>
                {applications.length === 0 ? (
                  <h2>No applicants yet.</h2>
                ) : (
                  applications.map((application) => (
                    <div
                      key={application.creator.user.username}
                      className="job-applicant"
                      onClick={() => {
                        setProfile(application.creator.user.username);
                        setAnswers(application.answers);
                        handleSelect(application.creator.user.username);
                      }}
                      style={{ cursor: "pointer" }}
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
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAnswer && (
        <AnswerModal
          onClose={() => setShowAnswer(false)}
          questions={questions}
          answers={answers}
          profile={profile}
        />
      )}
    </div>
  );
};

export default MyJobs;
