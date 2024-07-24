import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./jobs.css";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://192.168.1.106:8000/jobs/my-jobs/${jobId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        });
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setError("Error fetching applicants");
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="applicant-list">
      <h1>Applicants for Job {jobId}</h1>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        applicants.map((applicant) => (
          <div key={applicant.user.username} className="applicant">
            <h2>{applicant.user.name}</h2>
            <p>Username: {applicant.user.username}</p>
            <p>Email: {applicant.user.email}</p>
            <p>Area: {applicant.area}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default JobApplicants;
