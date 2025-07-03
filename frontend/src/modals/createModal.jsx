import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const CreateModal = ({ onClose, createPost, createCollab }) => {
  const { type } = useSelector((state) => state.auth);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <div className="modal-background">
      <div className="modal-container noselect">
        <div className="modal-header">
          <h1>Create</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body p-5">
          <div
            className="border mb-5 p-2 rounded-2xl shadow-lg hover:shadow"
            onClick={() => {
              onClose();
              createPost(true);
            }}
          >
            <h1 className="font-bold text-xl">Post</h1>
            {type === "creator" ? (
              <p>
                Upload an image from a previous brand collaboration or campaign
                you've been part of. This helps businesses understand your
                content style and reach — and increases your chances of getting
                hired.
              </p>
            ) : (
              <p>
                Share visuals from previous influencer campaigns or highlight
                your products/services. This helps creators discover your brand
                and builds trust for future partnerships.
              </p>
            )}
          </div>

          {type === "business" && (
            <div
              className="border mb-5 p-2 rounded-2xl shadow-lg hover:shadow"
              onClick={() => {
                onClose();
                createCollab(true);
              }}
            >
              <h1 className="font-bold text-xl">Collaboration</h1>
              <p>
                Post a collaboration opportunity to connect with creators who
                match your brand. Set your requirements, ask screening
                questions, and choose the best creator for your next paid
                promotion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
