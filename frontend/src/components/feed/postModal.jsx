import React, { useState } from "react";
import axios from "axios";
import DropdownSearch from "../../common/dropdown";
import DropdownSearchSelect from "../../common/dropdownSelect";

const PostModal = ({ onClose, onPostCreated, type }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No file detected!");
  const [collab, setCollab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleCreatePost = async () => {
    if (!caption || !image) {
      alert("Please provide both an image and a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);
    formData.append("collaboration", collab);

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

  const handleSearchChange = async (q) => {
    setSearchQuery(q);
    if (q.length > 0) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/search-business?q=${q}`
        );
        if (response.data) {
          setSearchResults(response.data);
        }
      } catch (error) {
        alert("Error fetching results");
      }
    } else {
      setSearchResults([]);
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

        <form className="reg-form modal-body">
          <div className="reg-form-container">
            <div className="reg-secondary">
              <div className="form-input input-secondary">
                <label
                  htmlFor="profile_photo"
                  className="button-54 button-file"
                >
                  Add Photo
                </label>
                <input
                  type="file"
                  id="profile_photo"
                  name="profile_photo"
                  onChange={handleImageChange}
                  placeholder="Profile Photo"
                />
                <span>{fileName}</span>
              </div>

              <div className="form-input input-secondary">
                <label className="input-label">Add a caption</label>
                <textarea
                  name="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="caption..."
                  required
                />
              </div>

              {type === "creator" && (
                <div className="form-input input-secondary">
                  <label className="input-label">
                    <h4>Collaboration</h4>
                    <p>
                      If you are collaborating with any business for this post,
                      add it here
                    </p>
                  </label>
                  <DropdownSearchSelect
                    searchResults={searchResults}
                    searchQuery={searchQuery}
                    handleSearchChange={handleSearchChange}
                    collab={collab}
                    setCollab={setCollab}
                  />
                </div>
              )}
            </div>
          </div>
        </form>

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
