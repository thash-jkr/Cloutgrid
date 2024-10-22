import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleArrows,
  faBriefcase,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "./feed.css";

const RightColumn = ({ suggestions, applicants, jobs, type }) => {
  const [suggestionDropdown, setSuggestionDropdown] = useState(false);
  const [jobDropdown, setJobDropdown] = useState(false);

  return (
    <div className="right-container">
      <div
        className="home-card card-3"
        onMouseEnter={() => setSuggestionDropdown(true)}
        onMouseLeave={() => setSuggestionDropdown(false)}
      >
        <h1>
          Suggestions{" "}
          <span>
            <FontAwesomeIcon icon={faPeopleArrows} />
          </span>
        </h1>
        <div className={`home-suggestions ${suggestionDropdown ? "open" : ""}`}>
          {suggestions.map((suggestion) => (
            <div key={suggestion.user.username} className="home-suggestion">
              <div className="suggestion-container">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${suggestion.user.profile_photo}`}
                  alt="Profile"
                />
                <Link to={`/profiles/${suggestion.user.username}`}>
                  <h3>{suggestion.user.name}</h3>
                </Link>
              </div>
              {suggestion.area ? (
                <p>{suggestion.area}</p>
              ) : (
                <p>{suggestion.target_audience}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="home-card card-4"
        onMouseEnter={() => setJobDropdown(true)}
        onMouseLeave={() => setJobDropdown(false)}
      >
        {type === "creator" ? (
          <h1>
            Recent Jobs{" "}
            <span>
              <FontAwesomeIcon icon={faBriefcase} />
            </span>
          </h1>
        ) : (
          <h1>
            Recent Applicants{" "}
            <span>
              <FontAwesomeIcon icon={faUser} />
            </span>
          </h1>
        )}
        <div className={`jobs-container ${jobDropdown ? "open" : ""}`}>
          {type === "creator" && (
            <div className="home-jobs">
              {jobs.map((job) => {
                return (
                  <div key={job.id} className="home-job">
                    <h3>{job.title}</h3>
                    <p>{job.posted_by.user.name}</p>
                  </div>
                );
              })}
            </div>
          )}
          {type === "business" && (
            <div className="home-applicants">
              {applicants.length > 0 ? (
                <div className="home-applicants">
                  {applicants.map((applicant) => (
                    <div
                      key={applicant.creator.user.username}
                      className="home-applicant"
                    >
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}${applicant.creator.user.profile_photo}`}
                        alt="Profile"
                      />
                      <Link to={`/profiles/${applicant.creator.user.username}`}>
                        <h3>{applicant.creator.user.name}</h3>
                      </Link>
                      <p>{applicant.creator.area}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No new applicants yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightColumn;
