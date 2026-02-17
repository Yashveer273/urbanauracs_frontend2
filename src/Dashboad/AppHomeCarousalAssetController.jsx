import React, { useEffect, useState } from "react";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseCon";

/* ---------- Template Labels (UI friendly) ---------- */
const bannerTypeMap = {
  banner_m_style_1: "Medium Banner Style 1",
  banner_m_style_2: "Medium Banner Style 2",
  banner_m_style_3: "Medium Banner Style 3",
  banner_m_style_4: "Medium Banner Style 4",
  banner_with_counter: "Banner With Countdown",
};

const emptyBanner = {
  type: "banner_m_style_4",
  title: "",
  subtitle: "",
  image: "",
  discount: 0,
  press: true,
};

export default function BannerController() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyBanner);
  const [editIndex, setEditIndex] = useState(null);

  const ref = doc(firestore, "appAssets", "app-image-banner");

  /* ---------- Load Data ---------- */
  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) setBanners(snap.data().data || []);
      else await setDoc(ref, { data: [] });
    };
    load();
  }, []);

  /* ---------- Save to Firestore ---------- */
  const save = async updated => {
    setBanners(updated);
    await updateDoc(ref, { data: updated });
  };

  /* ---------- Add / Update ---------- */
  const submit = () => {
    const updated =
      editIndex === null
        ? [...banners, form]
        : banners.map((b, i) => (i === editIndex ? form : b));

    save(updated);
    setForm(emptyBanner);
    setEditIndex(null);
  };

  /* ---------- Delete ---------- */
  const remove = index => save(banners.filter((_, i) => i !== index));

  /* ---------- Edit ---------- */
  const edit = index => {
    setForm(banners[index]);
    setEditIndex(index);
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Banner Manager</h1>

      {/* ---------- FORM ---------- */}
      <div className="bg-white p-4 rounded-xl shadow mb-8 grid gap-3">
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          className="border p-2 rounded"
        >
          {Object.entries(bannerTypeMap).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={e => setForm({ ...form, subtitle: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Image URL"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
          className="border p-2 rounded"
        />

        <input
  type="number"
  min="0"
  placeholder="Discount"
  value={form.discount}
  onChange={e =>
    setForm({
      ...form,
      discount: Math.max(0, Number(e.target.value))
    })
  }
  className="border p-2 rounded"
/>


        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.press}
            onChange={e => setForm({ ...form, press: e.target.checked })}
          />
          Clickable Banner
        </label>

        <button
          onClick={submit}
          className="bg-blue-600 text-white p-2 rounded font-semibold"
        >
          {editIndex === null ? "Add Banner" : "Update Banner"}
        </button>
      </div>

      {/* ---------- LIST ---------- */}
      <div className="grid md:grid-cols-2 gap-4">
        {banners.map((b, i) => (
          <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
            <img src={b.image} className="h-40 w-full object-cover" alt="" />

            <div className="p-4 text-sm space-y-1">
              <p className="font-semibold">{bannerTypeMap[b.type]}</p>
              <p>{b.title}</p>
              <p>{b.subtitle}</p>
              <p>Discount: {b.discount}%</p>
              <p>Clickable: {b.press ? "Yes" : "No"}</p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => edit(i)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => remove(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
