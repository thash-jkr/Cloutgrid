import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./jobs.css";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.106:8000/jobs/${id}/`
        );
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    const checkApplied = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.106:8000/jobs/${id}/status/`
        );
        setApplied(response.data.is_applied);
      } catch (error) {
        console.error("Error fetching job status:", error);
      }
    };

    fetchJob();
    checkApplied();
  }, [id, applied]);

  const handleApply = async () => {
    try {
      const response = await axios.post(
        `http://192.168.1.106:8000/jobs/${id}/apply/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setApplied(true);
      console.log("Applied successfully:", response.data);
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="job-detail">
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>Posted by: {job.posted_by.user.name}</p>
      <p>
        Company Website:{" "}
        <a href={job.company_website} target="_blank" rel="noopener noreferrer">
          {job.company_website}
        </a>
      </p>
      <p>Due Date: {job.due_date}</p>
      <p>Requirements: {job.requirements}</p>
      <p>Target Creator: {job.target_creator}</p>
      <button onClick={handleApply} disabled={applied}>
        {applied ? "Applied" : "Apply"}
      </button>
    </div>
  );
};

export default JobDetail;
