import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleArrows,
  faBriefcase,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import "./feed.css";
import axios from "axios";
import { useSelector } from "react-redux";

const RightColumn = () => {
  const [suggestionDropdown, setSuggestionDropdown] = useState(false);
  const [jobDropdown, setJobDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const { user, type } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/users/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const all_creators = response.data.creators;
        const all_businesses = response.data.businesses;
        const sug_creators = [];
        const sug_businesses = [];
        const sug_final = [];

        const getRandomElements = (arr, count) => {
          const shuffled = [...arr];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled.slice(0, count);
        };

        const filterAndPushSuggestions = (allItems, sugItems, condition) => {
          for (let item of allItems) {
            if (item.user.username !== user.user.username && condition(item)) {
              sugItems.push(item);
            }
          }

          if (sugItems.length === 0) {
            if (allItems.length <= 3) {
              sug_final.push(...allItems);
            } else {
              sug_final.push(...getRandomElements(allItems, 3));
            }
          } else {
            if (sugItems.length <= 3) {
              sug_final.push(...sugItems);
            } else {
              sug_final.push(...getRandomElements(sugItems, 3));
            }
          }
        };

        filterAndPushSuggestions(all_creators, sug_creators, (creator) => {
          if (type === "creator" && creator.area === user.area) {
            return true;
          } else if (
            type === "business" &&
            creator.area === user.target_audience
          ) {
            return true;
          }
          return false;
        });

        filterAndPushSuggestions(all_businesses, sug_businesses, (business) => {
          if (type === "creator" && business.target_audience === user.area) {
            return true;
          } else if (
            type === "business" &&
            business.target_audience === user.target_audience
          ) {
            return true;
          }
          return false;
        });

        setSuggestions(sug_final);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (type === "creator") {
      const fetchLatestJobs = async () => {
        try {
          const accessToken = localStorage.getItem("access");
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/jobs/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const sortedJobs = response.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          setJobs(sortedJobs.slice(0, 3));
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      };
      fetchLatestJobs();
    } else {
      const fetchLatestJobAndApplicants = async () => {
        try {
          const accessToken = localStorage.getItem("access");
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const alljobs = response.data;

          for (let job of alljobs) {
            const applicantsResponse = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/${job.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const applicants = applicantsResponse.data;
            if (applicants.length > 0) {
              setApplicants(applicants);
              break;
            }
          }
        } catch (error) {
          console.error("Error fetching jobs or applicants:", error);
        }
      };

      fetchLatestJobAndApplicants();
    }
  }, []);

  return (
    <div className="center-vertical w-full ml-5">
      <div className="center-vertical shadow w-full rounded-xl cursor-pointer hover:shadow relative group bg-white">
        <div
          className="w-full center"
          onClick={() => setSuggestionDropdown(!suggestionDropdown)}
        >
          <h1 className="font-bold text-xl my-3 center">
            <div className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mr-1">
                Suggestions
              </span>
            </div>
            <span>
              <FontAwesomeIcon icon={faPeopleArrows} />
            </span>
            <span
              className={`absolute right-3 transition-transform duration-500 ${
                !suggestionDropdown &&
                "duration-300 group-hover:scale-125 group-hover:rotate-12"
              } ${suggestionDropdown ? "rotate-180" : ""}`}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </h1>
        </div>

        <div className={`${suggestionDropdown ? "flex" : "hidden"} w-full`}>
          <div className="flex w-full p-1 max-h-96 overflow-y-scroll noscroll rounded-xl">
            {suggestions.length > 0 ? (
              <ul className="divide-y w-full">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.user.username}
                    className="flex justify-start items-center p-2 hover:bg-slate-50"
                    onClick={() =>
                      navigate(`/profiles/${suggestion.user.username}`)
                    }
                  >
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${suggestion.user.profile_photo}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />

                    <div className="flex flex-col text-sm justify-center items-start">
                      <h3 className="font-bold">{suggestion.user.name}</h3>

                      <div className="text-sm">
                        {suggestion.area ? (
                          <p>{suggestion.area}</p>
                        ) : (
                          <p>{suggestion.target_audience}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No suggestions to show!</p>
            )}
          </div>
        </div>
      </div>

      <div className="center-vertical shadow w-full rounded-xl mt-5 cursor-pointer hover:shadow relative group bg-white">
        <div
          className="w-full center"
          onClick={() => setJobDropdown(!jobDropdown)}
        >
          {type === "creator" ? (
            <h1 className="font-bold text-xl my-3 center">
              <div className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mr-1">
                  Collabs
                </span>
              </div>
              <span>
                <FontAwesomeIcon icon={faBriefcase} />
              </span>
              <span
                className={`absolute right-3 transition-transform duration-500 ${
                  !jobDropdown &&
                  "duration-300 group-hover:scale-125 group-hover:rotate-12"
                } ${jobDropdown ? "rotate-180" : ""}`}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </h1>
          ) : (
            <h1 className="font-bold text-xl my-3 center">
              <div className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mr-1">
                  Applications
                </span>
              </div>
              <span>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span
                className={`absolute right-3 transition-transform duration-500 ${
                  !jobDropdown &&
                  "duration-300 group-hover:scale-125 group-hover:rotate-12"
                } ${jobDropdown ? "rotate-180" : ""}`}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </h1>
          )}
        </div>

        <div className={`${jobDropdown ? "flex" : "hidden"} w-full`}>
          {type === "creator" && (
            <div className="flex w-full p-1 max-h-96 overflow-y-scroll noscroll rounded-xl">
              {jobs.length > 0 ? (
                <ul className="divide-y w-full">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex justify-start items-center p-2 hover:bg-slate-50"
                      onClick={() => navigate("/jobs")}
                    >
                      <img
                        src={`${job.posted_by.user.profile_photo}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2"
                      />

                      <div className="flex flex-col text-sm justify-center items-start">
                        <h3 className="font-bold">{job.title}</h3>
                        <p className="text-sm">{job.posted_by.user.name}</p>
                      </div>
                    </div>
                  ))}
                </ul>
              ) : (
                <p>No jobs to show!</p>
              )}
            </div>
          )}

          {type === "business" && (
            <div className="flex w-full p-1 max-h-96 overflow-y-scroll noscroll rounded-xl">
              {applicants.length > 0 ? (
                <div className="divide-y w-full">
                  {applicants.map((applicant) => (
                    <div
                      key={applicant.creator.user.username}
                      className="flex justify-start items-center p-2 hover:bg-slate-50"
                      onClick={() => navigate("/my-jobs")}
                    >
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}${applicant.creator.user.profile_photo}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2"
                      />

                      <div className="flex flex-col text-sm justify-center items-start">
                        <h3 className="font-bold">
                          {applicant.creator.user.name}
                        </h3>
                        <p className="text-sm">{applicant.creator.area}</p>
                      </div>
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
