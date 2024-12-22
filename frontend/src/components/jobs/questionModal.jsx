import React from "react";

const QuestionModal = ({ job, onClose, answers, setAnswers, onSubmit }) => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Please answer the following questions</h2>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-questions">
            <h2>Questions</h2>
            <ol>
              {job.questions.split(",").map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ol>
          </div>
          <div className="modal-answers">
            <h2>Answers</h2>
            <textarea
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder="Enter your answers here...!"
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="button-54" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
