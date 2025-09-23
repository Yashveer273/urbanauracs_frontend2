import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseCon";

export default function HomeCarousalAssetController() {
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [editingState, setEditingState] = useState({
    index: null,
    src: "",
    altText: "",
  });

  const sliderDocRef = doc(firestore, "homeCleaningSlider", "mainDoc");

  // ===== Load images from Firestore on mount =====
  useEffect(() => {
    const fetchImages = async () => {
      const snap = await getDoc(sliderDocRef);
      if (snap.exists()) {
        setImages(snap.data().data || []);
      } else {
        // initialize empty doc if not present
        await setDoc(sliderDocRef, { data: [] });
      }
    };
    fetchImages();
  }, []);

  // ===== Add New Image =====
  const handleAddImage = async () => {
    if (newImageUrl.trim() !== "") {
      const newImage = { src: newImageUrl, alt: "User added image" };
      const updatedImages = [...images, newImage];

      setImages(updatedImages);
      await updateDoc(sliderDocRef, { data: updatedImages });

      setNewImageUrl("");
    }
  };

  // ===== Delete Image =====
  const handleDeleteImage = async (indexToDelete) => {
    const updatedImages = images.filter((_, index) => index !== indexToDelete);

    setImages(updatedImages);
    await updateDoc(sliderDocRef, { data: updatedImages });

    if (editingState.index === indexToDelete) {
      setEditingState({ index: null, src: "", altText: "" });
    }
  };

  // ===== Start Edit Mode =====
  const handleEditImage = (index) => {
    setEditingState({
      index,
      src: images[index].src,
      altText: images[index].alt,
    });
  };

  // ===== Save Edited Image =====
  const handleSaveEdit = async (index) => {
    const updatedImages = [...images];
    updatedImages[index].src = editingState.src;
    updatedImages[index].alt = editingState.altText;

    setImages(updatedImages);
    await updateDoc(sliderDocRef, { data: updatedImages });

    setEditingState({ index: null, src: "", altText: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center font-sans">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 sm:mb-8 ">
        Website Home Page Slider Controller
      </h1>

      {/* Input section */}
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Add New Image
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Enter image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <button
            onClick={handleAddImage}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Add Image
          </button>
        </div>
      </div>

      {/* Image gallery */}
      <div className="w-140 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Slider Images
        </h2>
        {images.length > 0 ? (
          <div className="flex gap-6 w-240">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 p-1 text-xs bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold opacity-80 hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-red-700 z-10"
                  aria-label="Delete image"
                >
                  X
                </button>

                {editingState.index === index ? (
                  <div className="p-4 flex flex-col gap-3">
                    <input
                      type="url"
                      value={editingState.src}
                      onChange={(e) =>
                        setEditingState({
                          ...editingState,
                          src: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Image URL"
                    />
                    <input
                      type="text"
                      value={editingState.altText}
                      onChange={(e) =>
                        setEditingState({
                          ...editingState,
                          altText: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Image Description"
                    />
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-48 object-cover object-center rounded-t-2xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x300/e5e7eb/768393?text=Image+Not+Found";
                        e.target.alt = "Image could not be loaded";
                      }}
                    />
                    <div className="p-4">
                      <p className="text-center text-sm text-gray-600 mb-2">
                        {image.alt}
                      </p>
                      <button
                        onClick={() => handleEditImage(index)}
                        className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No images to display. Add some using the form above!
          </p>
        )}
      </div>
    </div>
  );
}
