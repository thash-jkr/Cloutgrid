import React from "react";
import { Link } from "react-router-dom";

const AnswerModal = ({ onClose, questions, answers, profile }) => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Applicant responses</h2>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-questions">
            <h2>Questions</h2>
            <ol>
              {questions.split(",").map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ol>
          </div>
          <div className="modal-answers">
            <h2>Answers</h2>
            <p>{answers}</p>
          </div>
        </div>

        <div className="modal-footer">
          <Link to={`/profiles/${profile}`}>
            <button className="button-54">View Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;
