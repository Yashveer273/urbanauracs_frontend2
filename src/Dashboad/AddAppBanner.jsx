import React, { useState, useEffect } from "react";
import { firestore } from "../firebaseCon";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function AddAppBanner() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);

  const ref = doc(firestore, "appAssets", "app-image-banner");

  const fetchBanners = async () => {
    try {
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setBanners(snap.data().data || []);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Fetch banners error:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async () => {
    if (!image.trim()) {
      alert("Please enter image URL");
      return;
    }

    try {
      setLoading(true);

      const snap = await getDoc(ref);
      const existingData = snap.exists() ? snap.data().data || [] : [];

      const newBanner = {
        title: "",
        subtitle: "",
        discount: null,
        image: image.trim(),
        duration: null,
        press: false,
        type: "",
      };

      const updatedData = [...existingData, newBanner];

      if (snap.exists()) {
        await updateDoc(ref, { data: updatedData });
      } else {
        await setDoc(ref, { data: updatedData });
      }

      setImage("");
      setBanners(updatedData);
    } catch (error) {
      console.error("Save banner error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (index) => {
    try {
      const updated = banners.filter((_, i) => i !== index);

      await updateDoc(ref, { data: updated });
      setBanners(updated);
    } catch (error) {
      console.error("Delete banner error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              App Slider Banner
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add banner image URL for mobile app slider.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>

            <input
              placeholder="Paste banner image URL here"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />

            <p className="text-xs text-gray-500 mt-2">
              Recommended size: <b>1200 × 500 px</b> | Ratio 12:5
            </p>
          </div>

          {image && (
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
              <img
                src={image.trim() || null}
                alt="Preview"
                className="w-full max-h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-800 transition"
          >
            {loading ? "Saving..." : "Save Banner"}
          </button>
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Banner List</h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage saved app slider banners.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 text-left font-medium">Image</th>
                  <th className="p-4 text-left font-medium">Image URL</th>
                  
                  <th className="p-4 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {banners.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-6 text-center text-gray-500"
                    >
                      No banners added yet.
                    </td>
                  </tr>
                ) : (
                  banners.map((banner, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        <img
                          src={banner.image?.trim() || null}
                          className="h-14 w-24 object-cover rounded-lg border border-gray-200"
                          alt="Banner"
                        />
                      </td>

                      <td className="p-4 max-w-[360px]">
                        <div className="truncate text-gray-700">
                          {banner.image || "-"}
                        </div>
                      </td>

                      

                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteBanner(index)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
