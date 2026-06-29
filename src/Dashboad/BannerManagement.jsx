import React, { useEffect, useState } from "react";
import { BannerManagementAPI } from "../API";
import ImageUploadPopup from "./ImageUploadPopup";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [directUrl, setDirectUrl] = useState("");
  const [bannerType, setBannerType] = useState("banner1");
  const [loading, setLoading] = useState(false);

  const loadBanners = async () => {
    const res = await BannerManagementAPI("get");
    if (res.success) setBanners(res.data);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleAddBanner = async () => {
    const existingBanner = banners.find(
      (banner) => banner.bannerType === bannerType
    );

    if (existingBanner) {
      alert(
        `A banner is already assigned to ${bannerType}. Please delete the existing one first.`
      );
      return;
    }

    if (!directUrl.trim()) {
      alert("Please enter image URL");
      return;
    }

    setLoading(true);

    try {
      const res = await BannerManagementAPI("add", {
        imageLink: directUrl.trim(),
        bannerType,
      });

      if (res.success) {
        setDirectUrl("");
        await loadBanners();
        alert("Banner published successfully!");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this banner?")) {
      await BannerManagementAPI("delete", { id });
      loadBanners();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Banner Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Add and manage storefront banners using image URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          {/* FORM */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Add New Banner
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Paste image URL or use the image upload component.
              </p>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Image URL
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  placeholder="Paste direct image URL..."
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                />

                <ImageUploadPopup />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Banner Slot
              </label>

              <select
                value={bannerType}
                onChange={(e) => setBannerType(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              >
                <option value="banner1">Banner 1 - Hero</option>
                <option value="banner2">Banner 2 - Promotion</option>
              </select>
            </div>

            <button
              onClick={handleAddBanner}
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Banner"}
            </button>
          </div>

          {/* BANNERS */}
          <div>
            {banners.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="h-64 overflow-hidden bg-slate-100">
                      <img
                        src={banner.imageLink}
                        alt={banner.bannerType}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {banner.bannerType === "banner1"
                          ? "Banner 1"
                          : "Banner 2"}
                      </span>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900">
                            Active Banner
                          </h3>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {banner.imageLink}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="shrink-0 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    No banners added
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Add Banner 1 or Banner 2 to update your storefront.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;