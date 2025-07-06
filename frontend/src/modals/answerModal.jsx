import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const AnswerModal = ({ onClose, questions, answers, profile }) => {
  const getQuestion = (answer) => {
    const item = questions.find((question) => question.id === answer.question);
    return item ? item.content : "No Question Found!";
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Application Answers</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body w-full divide-y overflow-y-scroll">
          {answers.map((answer) => (
            <div className="form-input w-full center-left mb-3" key={answer.id}>
              <label>{getQuestion(answer)}</label>
              <p className="bg-white w-full min-h-20 border rounded-2xl p-3 mt-2">
                {answer.content}
              </p>
            </div>
          ))}
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
