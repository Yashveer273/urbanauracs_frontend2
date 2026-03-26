import React, { useState, useEffect } from "react";
import { firestore } from "../firebaseCon";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc
} from "firebase/firestore";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function AddAppBanner() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("banner_m_style_1");
  const [press, setPress] = useState(true);
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);

  const ref = doc(firestore, "appAssets", "app-image-banner");

  // FETCH BANNERS
  const fetchBanners = async () => {
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data().data || [];
      setBanners(data);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const snap = await getDoc(ref);

      let existingData = [];

      if (snap.exists()) {
        existingData = snap.data().data || [];
      }

      const newBanner = {
        title,
        subtitle,
        discount: Number(discount),
        image,
        duration: duration ? Number(duration) : null,
        press,
        type,
      };

      const updatedData = [...existingData, newBanner];

      if (snap.exists()) {
        await updateDoc(ref, { data: updatedData });
      } else {
        await setDoc(ref, { data: [newBanner] });
      }

      setTitle("");
      setSubtitle("");
      setDiscount("");
      setImage("");
      setDuration("");

      fetchBanners();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const deleteBanner = async (index) => {
    const updated = banners.filter((_, i) => i !== index);

    await updateDoc(ref, { data: updated });

    setBanners(updated);
  };

  return (
    <div className="p-6">

      {/* FORM */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">
          App Slider Banners
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            placeholder="Title"
            className="border rounded-lg px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Subtitle"
            className="border rounded-lg px-3 py-2"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Discount"
            className="border rounded-lg px-3 py-2"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <input
            type="number"
            placeholder="Duration (hours)"
            className="border rounded-lg px-3 py-2"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

        </div>

        <div className="mt-4">
  <input
    placeholder="Image URL"
    className="border rounded-lg px-3 py-2 w-full"
    value={image}
    onChange={(e) => setImage(e.target.value)}
  />

  <p className="text-xs text-gray-500 mt-1">
    Recommended size: <b>1200 × 500 px</b> (Ratio 12:5)
  </p>
</div>

        {image && (
          <img
            src={image}
            alt="preview"
            className="mt-3 rounded-lg h-40 object-cover"
          />
        )}

        <div className="flex gap-4 mt-4">

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="banner_m_style_1">Banner Style 1</option>
            <option value="banner_m_style_2">Banner Style 2</option>
            <option value="banner_m_style_3">Banner Style 3</option>
            <option value="banner_m_style_4">Banner Style 4</option>
            <option value="banner_with_counter">
              Banner With Counter
            </option>
          </select>

          <button
            onClick={() => setPress(!press)}
            className={`px-4 py-2 rounded ${
              press ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {press ? "Clickable" : "Not Clickable"}
          </button>

        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-black text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>
      </motion.div>

      {/* TABLE */}
      <div className="mt-10 bg-white border rounded-xl shadow-sm">

        <div className="p-4 border-b font-semibold">
          Banner List
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner, index) => (
              <tr key={index} className="border-t">

                <td className="p-3">
                  <img
                    src={banner.image}
                    className="h-12 w-20 object-cover rounded"
                    alt=""
                  />
                </td>

                <td className="p-3">{banner.title}</td>

                <td className="p-3">
                  {banner.discount}%
                </td>

                <td className="p-3">
                  {banner.duration || "-"}
                </td>

                <td className="p-3">
                  {banner.type}
                </td>

                <td className="p-3">

                  <button
                    onClick={() => deleteBanner(index)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}