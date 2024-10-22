import React, { useState } from "react";
import axios from "axios";

const PostModal = ({ onClose, onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreatePost = async () => {
    if (!caption || !image) {
      alert("Please provide both an image and a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onPostCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create a new Post</h2>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="button-54" onClick={handleCreatePost}>
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
