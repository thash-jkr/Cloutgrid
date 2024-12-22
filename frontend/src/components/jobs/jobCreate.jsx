import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getCSRFToken } from "../../getCSRFToken";

const JobPostForm = () => {
  const [auth, setAuth] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    requirements: "",
    questions: "",
    target_creator: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "X-CSRFToken": getCSRFToken(),
          },
        }
      );
      if (response.status === 201) {
        alert("Job post created successfully!");
        navigate("/");
      }
    } catch (error) {
      alert("Error", error.response.data);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  if (!auth) {
    return (
      <div>
        <h2>Create a Job Post</h2>
        <p>You must be logged in to create a job post.</p>
      </div>
    );
  }

  const AREA_CHOICES = [
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

  return (
    <div className="reg-comp-main">
      <div className="reg-comp-body">
        <Link to={"/"}>
          <div className="reg-logo logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>
        <h1>Create a Job Post</h1>
        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="reg-form-container">
            <div className="reg-secondary">
              <div className="inputbox input-secondary">
                <label>Job title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  required
                />
              </div>
              <div className="inputbox input-secondary">
                <label>Job description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  required
                />
              </div>
              <div className="inputbox input-secondary">
                <label>
                  <h4>Requirements</h4>
                  <p>Enter all your requirements seperated by coma ","</p>
                </label>
                <textarea
                  type="textarea"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Job requirements"
                  required
                />
              </div>
              <div className="inputbox input-secondary">
              <label>
                  <h4>Questions</h4>
                  <p>Enter all your questions seperated by coma ","</p>
                </label>
                <textarea
                  type="textarea"
                  name="questions"
                  value={formData.questions}
                  onChange={handleChange}
                  placeholder="Questions (optional)"
                />
              </div>
              <div className="inputbox input-secondary">
                <label>Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  placeholder="Due Date"
                  required
                />
              </div>
              <div className="inputbox input-secondary">
                <label>Creator category</label>
                <select
                  name="target_creator"
                  value={formData.target_creator}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your target c reator</option>
                  {AREA_CHOICES.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button className="auth-button button-54" type="submit">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
