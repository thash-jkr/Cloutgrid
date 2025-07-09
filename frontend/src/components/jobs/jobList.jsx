import "animate.css";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchJobs, handleApplication } from "../../slices/jobSlice";
import QuestionModal from "../../modals/questionModal";
import NavBar from "../../common/navBar";
import "./jobs.css";
import useIsMobile from "../../hooks/useIsMobile";
import JobDetailModal from "../../modals/jobDetailModal";

const JobList = () => {
  const [id, setId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobs, jobLoading, jobError } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(fetchJobs());
  }, []);

  const handleApply = () => {
    if (selectedJob?.questions.length > 0) {
      setShowJobModal(false);
      setShowQuestion(true);
    } else {
      setShowJobModal(false);
      submitApplication();
    }
  };

  const submitApplication = () => {
    dispatch(handleApplication({ id, answers }))
      .unwrap()
      .then(() => {
        setShowQuestion(false);
        setShowQuestion(false);
        toast.success("Application Successful");
        setSelectedJob({ ...selectedJob, is_applied: true });
      })
      .catch((error) => {
        toast.error(jobError);
      });
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
    isMobile && setShowJobModal(true);
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
        <h1 className="animate__animated animate__fadeInDown font-bold text-2xl lg:text-3xl mb-3">
          Apply for Collaborations
        </h1>

        <div className="w-full h-[75vh] min-h-[400px] flex px-3 lg:px-0">
          <div
            className="overflow-y-scroll w-full noscroll border lg:mr-5 rounded-2xl bg-white 
               shadow p-2 lg:basis-1/3 divide-y"
          >
            {jobs.length > 0 ? (
              jobs?.map((job) => (
                <div
                  key={job.id}
                  className={`flex justify-start items-center p-2 hover:lg:bg-blue-100 ${
                    selectedJob?.id === job.id ? "lg:bg-blue-200" : ""
                  }`}
                  onClick={() => handleSelectJob(job)}
                >
                  <img
                    src={`${job.posted_by.user.profile_photo}`}
                    alt="Business Logo"
                    className="w-14 h-14 object-cover rounded-full mr-2"
                  />
                  <div className="flex flex-col justify-between items-start">
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="text-sm">{job.posted_by.user.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="null-text">
                <p>No new collaborations available!</p>
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-y-scroll noscroll border rounded-2xl bg-white shadow p-3 basis-2/3">
            {selectedJob ? (
              <div className="flex flex-col justify-start items-start">
                <h1 className="font-bold text-3xl">{selectedJob.title}</h1>

                <div className="py-2 center-left font-bold">
                  <p>
                    Posted by:{" "}
                    <span
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() =>
                        navigate(
                          `/profiles/${selectedJob.posted_by.user.username}`
                        )
                      }
                    >
                      {selectedJob.posted_by.user.name}
                    </span>
                  </p>
                  <p>
                    Due Date: <span>{selectedJob.due_date}</span>
                  </p>
                  <p>
                    Target Creator Category:{" "}
                    <span>
                      {AREA_OPTIONS_OBJECT[selectedJob.target_creator]}
                    </span>
                  </p>
                  {selectedJob.posted_by.website && (
                    <p>
                      Business Website:{" "}
                      <span className="cursor-pointer hover:text-blue-500">
                        {selectedJob.posted_by.website}
                      </span>
                    </p>
                  )}
                </div>

                <div className="m-3">
                  <button
                    className="button-54"
                    onClick={handleApply}
                    disabled={selectedJob.is_applied}
                  >
                    {selectedJob.is_applied ? "Applied" : "Apply"}
                  </button>
                </div>

                <div>
                  <div className="mt-5">
                    <h2 className="font-bold">Job Description</h2>
                    <p>{selectedJob.description}</p>
                  </div>

                  <div className="mt-5">
                    <h2 className="font-bold">Requirements</h2>
                    <ul>
                      {selectedJob.requirements.split(",").map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="null-text">
                <p>Please select a job to view details</p>
              </div>
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

      {showJobModal && (
        <JobDetailModal
          onClose={() => setShowJobModal(false)}
          selectedJob={selectedJob}
          handleApply={handleApply}
        />
      )}
    </div>
  );
};

export default JobList;
