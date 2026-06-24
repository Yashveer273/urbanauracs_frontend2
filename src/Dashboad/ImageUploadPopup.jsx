import React, { useState } from "react";
import { storage } from "../firebaseCon";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./ImageUploadPopup.css";

const ImageUploadPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const uploadImage = (file) => {
    if (!file) return;

    setLoading(true);
    setImageUrl("");
    setProgress(0);
    setCopied(false);

    const fileName = `uploads/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percent);
      },
      (error) => {
        console.error("Upload error:", error);
        alert("Image upload failed");
        setLoading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        setLoading(false);
      }
    );
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setImageUrl("");
    setLoading(false);
    setProgress(0);
    setCopied(false);
  };

  return (
    <>
      <button className="image-upload-btn" onClick={() => setShowPopup(true)}>
        Upload Image
      </button>

      {showPopup && (
        <div className="image-popup-overlay">
          <div className="image-popup-card">
            <button className="image-popup-close" onClick={closePopup}>
              ×
            </button>

            <h2>Upload Image</h2>

            <label className="image-upload-box">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => uploadImage(e.target.files[0])}
              />
              <span>Click to choose image</span>
            </label>

            {loading && (
              <div className="upload-loading-box">
                <div className="upload-spinner"></div>
                <p>Uploading... {progress}%</p>
              </div>
            )}

            {imageUrl && !loading && (
              <div className="uploaded-result">
                <img src={imageUrl} alt="Uploaded" />

                <input type="text" value={imageUrl} readOnly />

                <button onClick={copyUrl}>
                  {copied ? "Copied" : "Copy URL"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploadPopup;