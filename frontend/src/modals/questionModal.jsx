import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const QuestionModal = ({ job, onClose, answers, setAnswers, onSubmit }) => {
  const handleAnswer = (e, questionId) => {
    const { value } = e.target;
    setAnswers((prevState) => ({
      ...prevState,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const allAnswersFilled = job.questions.every((question) => {
      return answers[question.id] && answers[question.id].trim() !== "";
    });
    if (!allAnswersFilled) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    onSubmit();
  };

  return (
    <div className="modal-background">
      <Toaster />
      <div className="modal-container">
        <div className="modal-header">
          <h1>Application Questions</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body divide-y w-full">
          {job.questions.map((question) => (
            <div className="form-input w-full center-left mb-3">
              <label>{question.content}</label>
              <textarea
                name="description"
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswer(e, question.id)}
                placeholder="Enter a detailed answer to increase your chances of getting hired"
                required
              />
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="button-54" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
