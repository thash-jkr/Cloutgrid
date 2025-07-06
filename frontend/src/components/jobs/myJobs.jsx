import "xlsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./jobs.css";
import NavBar from "../navBar";
import { getCSRFToken } from "../../getCSRFToken";
import AnswerModal from "../../modals/answerModal";
import { Toaster } from "react-hot-toast";
import ShowConfirmToast from "../../modals/customToast";
import ApplicantsModal from "../../modals/applicantsModal";
import useIsMobile from "../../hooks/useIsMobile";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      } catch (error) {
        alert("Something went wrong");
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!selectedJob) {
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/${selectedJob.id}/`,
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
  }, [selectedJob]);

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
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/${selectedJob.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "X-CSRFToken": getCSRFToken(),
          },
        }
      );

      setJobs(jobs.filter((job) => job.id !== selectedJob.id));
      setSelectedJob(null);
    } catch (error) {
      alert("Error deleting job. Please try again.");
    }
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select Area" },
    { value: "art", label: "Art and Photography" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty and Makeup" },
    { value: "business", label: "Business" },
    { value: "diversity", label: "Diversity and Inclusion" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "fashion", label: "Fashion" },
    { value: "finance", label: "Finance" },
    { value: "food", label: "Food and Beverage" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health and Wellness" },
    { value: "home", label: "Home and Gardening" },
    { value: "outdoor", label: "Outdoor and Nature" },
    { value: "parenting", label: "Parenting and Family" },
    { value: "pets", label: "Pets" },
    { value: "sports", label: "Sports and Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "videography", label: "Videography" },
  ];

  const AREA_OPTIONS_OBJECT = AREA_OPTIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return (
    <div className="container mx-auto flex items-start mt-20 lg:mt-28 noselect">
      <NavBar />
      <Toaster />

      <div className="center-vertical w-full">
        <h1 className="animate__animated animate__fadeInDown font-bold text-3xl mb-3">
          Your Collaborations
        </h1>

        <div className="w-full h-[75vh] min-h-[400px] flex px-3 lg:px-0">
          <div
            className="overflow-y-scroll w-full noscroll border lg:mr-5 rounded-2xl bg-white 
               shadow p-2 lg:basis-1/3 divide-y"
          >
            {jobs.length === 0 ? (
              <div className="null-text">
                <p>You haven't created any Collaborations yet!</p>
              </div>
            ) : (
              jobs?.map((job) => (
                <div
                  key={job.id}
                  className={`flex justify-start items-center p-2 hover:lg:bg-blue-100 ${
                    selectedJob?.id === job.id ? "lg:bg-blue-200" : ""
                  }`}
                  onClick={() => {
                    setSelectedJob(job);
                    isMobile && setShowApplicantsModal(true);
                  }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${job.posted_by.user.profile_photo}`}
                    alt="Company Logo"
                    className="w-14 h-14 object-cover rounded-full mr-2"
                  />

                  <div className="flex flex-col justify-between items-start">
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="text-sm">Due: {job.due_date}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden lg:block overflow-y-scroll noscroll border rounded-2xl bg-white shadow basis-2/3">
            {selectedJob ? (
              <div className="flex flex-col justify-start items-start h-full">
                <div className="w-full flex flex-col xl:flex-row justify-center items-center border-b py-2">
                  <div className="basis-1/2 center text-center">
                    <h1 className="font-bold text-3xl">{selectedJob.title}</h1>
                  </div>

                  <div className="m-3 basis-1/2 center">
                    <button
                      className="button-54"
                      disabled={applications.length === 0 || toastOpen}
                      onClick={() => {
                        setToastOpen(true);
                        ShowConfirmToast(
                          handleDownload,
                          () => setToastOpen(false),
                          "This will download the data of all applicants and their answers as an Excel file. Are you sure you want to proceed?"
                        );
                      }}
                    >
                      Download Data
                    </button>

                    <button
                      className="button-54"
                      disabled={toastOpen}
                      onClick={() => {
                        setToastOpen(true);
                        ShowConfirmToast(
                          handleDelete,
                          () => setToastOpen(false),
                          "This will permanently delete the collaboration and all associated data. Make sure you download the before proceeding."
                        );
                      }}
                    >
                      Delete Collaboration
                    </button>
                  </div>
                </div>

                <div className="w-full flex justify-center items-start h-full divide-x">
                  <div className="lg:basis-1/2 flex flex-col justify-start items-center w-full h-full p-2">
                    <h2 className="font-bold text-lg my-2 underline underline-offset-8">
                      Applications
                    </h2>

                    {applications.length === 0 ? (
                      <div className="null-text">
                        <p>No applications yet!</p>
                      </div>
                    ) : (
                      <div className="mt-5 w-full">
                        <div className="w-full divide-y">
                          {applications.map((application) => (
                            <div
                              key={application.creator.user.username}
                              className={`flex justify-start items-center p-2 hover:lg:bg-blue-100 w-full`}
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
                                className="w-14 h-14 object-cover rounded-full mr-2"
                              />
                              <div className="flex flex-col justify-between items-start">
                                <h3 className="font-bold">
                                  {application.creator.user.name}
                                </h3>
                                <p className="text-sm">
                                  Category:{" "}
                                  {
                                    AREA_OPTIONS_OBJECT[
                                      application.creator.area
                                    ]
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="hidden lg:basis-1/2 lg:flex flex-col justify-start items-center p-2 h-full">
                    <h2 className="font-bold text-lg my-2 underline underline-offset-8">
                      Questions
                    </h2>
                    {selectedJob.questions.length > 0 ? (
                      <div className="center-left w-full">
                        {selectedJob.questions.map((question) => (
                          <div className="font-semibold my-2" key={question.id}>
                            <h1>• {question.content}</h1>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="null-text">
                        <p>This collaboration does not have any questions!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="null-text">
                <p>Select a posted Collaboration to see the applications!</p>
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

      {showApplicantsModal && (
        <ApplicantsModal
          onClose={() => setShowApplicantsModal(false)}
          selectedJob={selectedJob}
          applications={applications}
          onDownload={() => {
            setToastOpen(true);
            ShowConfirmToast(
              handleDownload,
              () => setToastOpen(false),
              "This will download the data of all applicants and their answers as an Excel file. Are you sure you want to proceed?"
            );
          }}
          onDelete={() => {
            setToastOpen(true);
            ShowConfirmToast(
              handleDelete,
              () => setToastOpen(false),
              "This will permanently delete the collaboration and all associated data. Make sure you download the before proceeding."
            );
          }}
          toastOpen={toastOpen}
        />
      )}
    </div>
  );
};

export default MyJobs;
