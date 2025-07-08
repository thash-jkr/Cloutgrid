import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../common/cropImage";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleCreatePost } from "../slices/feedSlice";
import toast, { Toaster } from "react-hot-toast";

const PostCreateModal = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [collab, setCollab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [croppedPixels, setCroppedPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const { postLoading, postError } = useSelector((state) => state.feed);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedPixels(pixels);
  }, []);

  const cropImage = async () => {
    const result = await getCroppedImg(image, croppedPixels);
    setPreview(result.previewUrl);
    setFinalImage(result.file);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/search-business?q=${query}`
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

  const handleSubmit = () => {
    if (!caption || !finalImage) {
      toast.error("Please provide both an image and a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("image", finalImage);
    formData.append("caption", caption);
    formData.append("collaboration", collab);

    dispatch(handleCreatePost(formData))
      .unwrap()
      .then(() => {
        toast.success("Post created successfully!");
        setTimeout(() => onClose(), 300);
      })
      .catch((error) => {
        toast.error("An error occurred while creating the post.");
        console.error("Error creating post:", error);
      });
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-full h-full">
            {!image && !preview && (
              <div
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-full h-full border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center text-gray-500 cursor-pointer hover:border-blue-400"
              >
                <h1 className="font-mono font-bold text-lg">
                  Drag & drop or click to upload
                </h1>
              </div>
            )}

            {image && !preview && (
              <div className="relative w-full h-full overflow-hidden">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <button
                  onClick={cropImage}
                  className="button-54 absolute bottom-3 right-3"
                >
                  Crop
                </button>
              </div>
            )}

            {preview && (
              <div className="center-vertical h-full w-full">
                <img
                  src={preview}
                  alt="Cropped Preview"
                  className="w-3/4 mb-2"
                />
                <button className="button-54" onClick={() => setStep(2)}>
                  Confirm
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        );
      case 2:
        return (
          <div className="w-full center-vertical">
            <div className="form-input w-full center-left">
              <label>Caption:</label>
              <textarea
                placeholder="Enter a caption for your post"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="form-input w-full center-left">
              <label>Collaboration:</label>
              {!collab ? (
                <input
                  placeholder={collab ? "" : "Start typing to search..."}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  value={searchQuery}
                  disabled={collab}
                />
              ) : (
                <div className="p-1 px-3 bg-amber-500 rounded-xl font-bold center">
                  <p>{collab}</p>
                  <FontAwesomeIcon
                    icon={faClose}
                    className="ml-2 hover:text-white"
                    onClick={() => setCollab(null)}
                  />
                </div>
              )}
            </div>

            {searchQuery.length > 0 ? (
              searchResults.length > 0 ? (
                <div className="overflow-y-scroll noscroll w-full p-3 bg-white rounded-2xl shadow border mb-5">
                  <h1>Select Business you are collaborating with from below</h1>
                  {searchResults.map((business) => (
                    <Link
                      key={business.id}
                      onClick={() => {
                        setCollab(business.user.username);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <div
                        className="flex justify-start items-center p-2 hover:bg-gray-50"
                        key={business.id}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}/${business?.user.profile_photo}`}
                          alt="Profile"
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        <h1 className="font-bold">{business?.user.name}</h1>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div>
                  <h1>No results!</h1>
                </div>
              )
            ) : !collab && (
              <div>
                <h1>Search for Collaboration</h1>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div>
            <h1>Something went wrong!</h1>
          </div>
        );
    }
  };

  return (
    <div className="modal-background">
      <Toaster />
      <div className="modal-container noselect">
        <div className="modal-header">
          <div className="center">
            {(step === 2 || image) && (
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="mr-2"
                onClick={() => {
                  if (step === 2) {
                    setStep(1);
                  } else if (preview) {
                    setPreview(null);
                  } else {
                    setImage(null);
                  }
                }}
              />
            )}
            <h1>Create Post</h1>
          </div>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body">{renderContent()}</div>

        {step === 2 && (
          <div className="center py-2">
            <button className="button-54" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCreateModal;
