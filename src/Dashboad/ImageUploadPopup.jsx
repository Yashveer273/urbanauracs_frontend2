import React, { useState } from "react";
import { storage } from "../firebaseCon";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "./ImageUploadPopup.css";

const ImageUploadPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const [deleteUrl, setDeleteUrl] = useState("");
  const [deleting, setDeleting] = useState(false);
const imageRef = ref(storage, deleteUrl.trim());
  const uploadImage = (file) => {
    if (!file) return;

    setLoading(true);
    setImageUrl("");
    setProgress(0);
    setCopied(false);

    const safeFileName = file.name.replace(/\s+/g, "_");
    const fileName = `uploads/${Date.now()}_${safeFileName}`;

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

  const deleteImageByUrl = async () => {
    if (!deleteUrl.trim()) {
      alert("Please enter image URL");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image from Firebase Storage?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const imageRef = ref(storage, deleteUrl.trim());
      await deleteObject(imageRef);

      alert("Image deleted successfully");
      setDeleteUrl("");
    } catch (error) {
      console.error("Delete error:", error);

      if (error.code === "storage/object-not-found") {
        alert("Image not found in Firebase Storage");
      } else if (error.code === "storage/unauthorized") {
        alert("You do not have permission to delete this image");
      } else {
        alert("Failed to delete image");
      }
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = async () => {
    if (!imageUrl) return;

    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setImageUrl("");
    setLoading(false);
    setProgress(0);
    setCopied(false);
    setDeleteUrl("");
    setDeleting(false);
  };

  return (
    <>
      <button
        type="button"
        className="image-upload-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPopup(true);
        }}
      >
        Upload Image
      </button>

      {showPopup && (
        <div className="image-popup-overlay">
          <div className="image-popup-card">
            <button
              type="button"
              className="image-popup-close"
              onClick={closePopup}
            >
              ×
            </button>

            <h2>Upload Image</h2>

            <label className="image-upload-box">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => uploadImage(e.target.files?.[0])}
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

                <button type="button" onClick={copyUrl}>
                  {copied ? "Copied" : "Copy URL"}
                </button>
              </div>
            )}

            <div className="delete-image-box">
              <h3>Delete Image</h3>

              <input
                type="text"
                placeholder="Paste Firebase image URL here"
                value={deleteUrl}
                onChange={(e) => setDeleteUrl(e.target.value)}
              />

              <button
                type="button"
                className="delete-image-btn"
                onClick={deleteImageByUrl}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploadPopup;