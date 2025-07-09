import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import imageCompression from "browser-image-compression";

const ImageUploaderWithCrop = ({ onImageCropped }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const fileInputRef = useRef();

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedPixels(pixels);
  }, []);

  const cropImage = async () => {
    const result = await getCroppedImg(image, croppedPixels);

    const compressedFile = await imageCompression(result.file, {
      maxSizeMB: 5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
    const compressedPreviewUrl = URL.createObjectURL(compressedFile);

    const correctedFile = new File([compressedFile], "image.jpg", {
      type: compressedFile.type,
    });

    setPreview(compressedPreviewUrl);
    onImageCropped({ file: correctedFile, preview: compressedPreviewUrl });
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  if (!image && !preview) {
    return (
      <div
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-full border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center text-gray-500 cursor-pointer hover:border-blue-400"
      >
        <h1 className="font-mono font-bold text-lg">
          Drag & drop or click to upload
        </h1>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  if (image && !preview) {
    return (
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
    );
  }

  if (preview) {
    return (
      <div className="center-vertical h-full w-full">
        <img src={preview} alt="Cropped Preview" className="w-3/4 mb-2" />
        <div className="space-x-2">
          <button className="button-54" onClick={reset}>
            Change
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ImageUploaderWithCrop;
