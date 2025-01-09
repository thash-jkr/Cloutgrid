import React, { useState } from "react";

const QuestionModal = ({ job, onClose, answers, setAnswers, onSubmit }) => {
  const [current, setCurrent] = useState(0);
  const [question, setQuestion] = useState(job.questions[0]);

  const handleAnswers = (e) => {
    setAnswers((prevState) => ({
      ...prevState,
      [question.id]: e.target.value,
    }));
  };

  const changeQuestion = (curr) => {
    setCurrent(curr);
    setQuestion(job.questions[curr]);
  };

  return (
    <div className="modal-background">
      <div className="modal-container" style={{ minWidth: "40vw" }}>
        <div className="modal-header">
          <h2>Please answer the following questions</h2>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-questions">
            <h2>
              Question{" "}
              <span>
                {current + 1} of {job.questions.length}
              </span>
            </h2>
            {question.content}
          </div>
          <div className="modal-answers">
            <h2>Answer</h2>
            <textarea
              value={answers[question.id]}
              onChange={(e) => handleAnswers(e)}
              placeholder="Enter your answers here...!"
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          {current !== 0 && (
            <button
              className="button-54"
              onClick={() => changeQuestion(current - 1)}
            >
              Go Back
            </button>
          )}
          {current !== job.questions.length - 1 && (
            <button
              className="button-54"
              onClick={() => changeQuestion(current + 1)}
              disabled={answers[question.id].length === 0}
            >
              Next
            </button>
          )}
          {current === job.questions.length - 1 && (
            <button
              className="button-54"
              onClick={onSubmit}
              disabled={answers[question.id].length === 0}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
