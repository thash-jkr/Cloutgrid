import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const CollabCreateModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    requirements: "",
    questions: [],
    target_creator: "",
  });
  const [question, setQuestion] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.due_date ||
      !formData.requirements ||
      !formData.target_creator
    ) {
      toast.error("Complete All Required Fields");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key === "questions") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Collaboration created successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("Error creating collaboration , please try again.");
    }
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select a Creator Category" },
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
    <div className="modal-background">
      <Toaster />
      <div className="modal-container">
        <div className="modal-header">
          <h1>Create Collaboration</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body overflow-y-scroll">
          <div className="form-input w-[90%] center-left">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title for your collab"
              required
            />
          </div>

          <div className="form-input w-[90%] center-left">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a detailed description about what you're looking for in a collaboration with a creator"
              required
            />
          </div>

          <div className="form-input w-[90%] center-left">
            <label>Requirements:</label>
            <input
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Enter the specific requirements, separated by commas"
              required
            />
          </div>

          <div className="form-input w-[90%] center-left relative">
            <label>Questions (optional):</label>
            <textarea
              name="questions"
              placeholder={`Optionally enter any questions you have for the creator. You can enter a question, then click "Add Question" to add it to the list. You can add multiple questions.`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <h1
              className="absolute font-bold text-blue-900 right-2 bottom-1 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                if (question) {
                  formData.questions.push(question);
                  setQuestion("");
                } else {
                  toast.error("Please enter a question before adding!");
                }
              }}
            >
              Add Question
            </h1>
          </div>

          {formData.questions.length > 0 && (
            <div className="form-input center-left w-[90%]">
              <label>Added questions:</label>

              <div className="overflow-y-scroll noscroll w-full p-1 bg-white rounded-2xl shadow border divide-y">
                {formData.questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-2 flex justify-between items-center"
                  >
                    <p>{question}</p>
                    <FontAwesomeIcon
                      icon={faClose}
                      className="hover:text-gray-500"
                      onClick={() => {
                        const newArr = formData.questions.filter(
                          (_, i) => i !== index
                        );
                        setFormData((prev) => ({
                          ...prev,
                          questions: newArr,
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-input center-left w-[90%]">
            <label>Target Creator Category:</label>
            <select
              name="target_creator"
              value={formData.target_creator}
              onChange={handleChange}
              required
            >
              {AREA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input center-left w-[90%]">
            <label>Due Date:</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  due_date: e.target.value,
                }))
              }
              placeholder="Due Date"
              required
            />
          </div>
        </div>

        <div className="center py-2">
          <button className="button-54" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollabCreateModal;
