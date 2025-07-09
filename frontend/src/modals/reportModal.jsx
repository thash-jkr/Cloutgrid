import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const ReportModal = ({ onClose, reportContent }) => {
  const [report, setReport] = useState("");

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h1>{reportContent.title}</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-input w-full center-left">
            <label className="text-justify p-1">{reportContent.body}</label>
            <textarea
              name="description"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Start writing..."
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="button-54" onClick={onClose}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
