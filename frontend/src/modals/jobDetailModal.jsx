import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JobDetailModal = ({ onClose, selectedJob, handleApply }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Details</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body">
          <div className="overflow-y-scroll noscroll p-3">
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
                  {selectedJob.posted_by.website && (
                    <p>
                      Website:{" "}
                      <span className="cursor-pointer hover:text-blue-500">
                        {selectedJob.posted_by.website}
                      </span>
                    </p>
                  )}
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

        <div className="modal-footer">
          <button
            className="button-54"
            onClick={handleApply}
            disabled={selectedJob.is_applied}
          >
            {selectedJob.is_applied ? "Applied" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
