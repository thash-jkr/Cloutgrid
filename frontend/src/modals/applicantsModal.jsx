import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ApplicantsModal = ({
  onClose,
  selectedJob,
  applications,
  onDownload,
  onDelete,
  toastOpen,
}) => {
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
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Details</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body">
          <div className="overflow-y-scroll noscroll p-3 w-full">
            {selectedJob ? (
              <div className="flex flex-col justify-start items-start w-full">
                <h1 className="font-bold text-3xl">{selectedJob.title}</h1>

                <div className="mt-2 w-full">
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
                            key={application.id}
                            className={`flex justify-start items-center p-2 hover:bg-blue-100 w-full`}
                            onClick={() => {}}
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
                                {AREA_OPTIONS_OBJECT[application.creator.area]}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
            onClick={onDownload}
            disabled={applications.length === 0 || toastOpen}
          >
            Download Data
          </button>

          <button className="button-54" onClick={onDelete} disabled={toastOpen}>
            Delete Collaboration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsModal;
