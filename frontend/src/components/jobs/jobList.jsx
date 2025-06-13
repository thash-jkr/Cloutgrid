import "animate.css";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser, faGlobe } from "@fortawesome/free-solid-svg-icons";

import { fetchJobs, handleApplication } from "../../slices/jobSlice";
import QuestionModal from "./questionModal";
import NavBar from "../navBar";
import "./jobs.css";

const JobList = () => {
  const [id, setId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const dispatch = useDispatch();

  const { jobs, jobLoading, jobError } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [id, showQuestion]);

  const handleApply = () => {
    if (selectedJob?.questions.length > 0) {
      setShowQuestion(true);
    } else {
      submitApplication();
    }
  };

  const submitApplication = () => {
    dispatch(handleApplication({ id, answers }));
    if (jobError) {
      toast.error(jobError);
      return;
    } else {
      toast.success("Application Successful");
    }
    setShowQuestion(false);
    setSelectedJob({ ...selectedJob, is_applied: true });
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    setAnswers({});
    if (job.questions) {
      for (const qq of job.questions) {
        setAnswers((prevState) => ({
          ...prevState,
          [qq.id]: "",
        }));
      }
    }
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setSelectedJob(null);
    setId(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div style={{height: "100vh"}}>
      <NavBar />
      <Toaster />
      <div className="job-main">
        <h1 className="animate__animated animate__fadeInDown">
          Apply for Collaborations
        </h1>
        <div className="job-container">
          <div className="job-listing">
            {jobs?.map((job) => (
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
                <div>
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
