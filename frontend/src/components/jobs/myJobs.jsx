import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./jobs.css";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://192.168.1.106:8000/jobs/my-jobs/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Error fetching jobs");
      }
    };

    fetchJobs();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="job-list">
      <h1>My Posted Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="job">
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p>Due Date: {job.due_date}</p>
            <p>Requirements: {job.requirements}</p>
            <p>Target Creator: {job.target_creator}</p>
            <Link to={`/my-jobs/${job.id}`}>View Applicants</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default MyJobs;
