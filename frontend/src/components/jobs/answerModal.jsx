import React from "react";

const AnswerModal = () => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Applicant responses</h2>
          <button className="close-modal" id="close-modal">
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;
