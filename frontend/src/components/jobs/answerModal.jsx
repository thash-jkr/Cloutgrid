import React, { useState } from "react";
import { Link } from "react-router-dom";

const AnswerModal = ({ onClose, questions, answers, profile }) => {
  const [current, setCurrent] = useState(0);

  const changeQuestion = (curr) => {
    setCurrent(curr);
  };

  return (
    <div className="modal-background">
      <div className="modal-container" style={{ minWidth: "40vw" }}>
        <div className="modal-header">
          <h2>Applicant responses</h2>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-questions">
            <h2>Question{" "}<span>{current + 1} of {questions.length}</span></h2>
            {questions[current].content}
          </div>
          <div className="modal-answers">
            <h2>Answers</h2>
            {answers[current].content}
          </div>
        </div>

        <div className="modal-footer">
          <Link to={`/profiles/${profile}`}>
            <button className="button-54">View Profile</button>
          </Link>
          <button
            className="button-54"
            onClick={() => changeQuestion(current - 1)}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            className="button-54"
            onClick={() => changeQuestion(current + 1)}
            disabled={current === questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;
