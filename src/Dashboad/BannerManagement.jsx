import React, { useEffect, useState } from "react";
import { BannerManagementAPI } from "../API";
import axios from "axios";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [directUrl, setDirectUrl] = useState("");
  const [bannerType, setBannerType] = useState("banner1");
  const [uploadMode, setUploadMode] = useState("file");
  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = "dwepuuspo";
  const UPLOAD_PRESET = "urbanAura";

  const loadBanners = async () => {
    const res = await BannerManagementAPI("get");
    if (res.success) setBanners(res.data);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const handleAddBanner = async () => {
    // 1. Check if the banner type already exists (Constraint: Only 1 image per banner)
    const existingBanner = banners.find(b => b.bannerType === bannerType);
    if (existingBanner) {
      alert(`A banner is already assigned to ${bannerType}. Please delete the existing one before adding a new one.`);
      return;
    }

    let finalImageUrl = "";
    if (uploadMode === "file") {
      if (!imageFile) return alert("Select a file");
      setLoading(true);
      try {
        finalImageUrl = await uploadToCloudinary();
      } catch (err) {
        alert("Upload failed");
        setLoading(false);
        return;
      }
    } else {
      if (!directUrl) return alert("Enter a URL");
      finalImageUrl = directUrl;
    }

    // 2. Save to DB
    const res = await BannerManagementAPI("add", {
      imageLink: finalImageUrl,
      bannerType,
    });

    if (res.success) {
      // 3. REMOVE FORM DATA ON SUCCESS
      setImageFile(null);
      setDirectUrl("");
      // Reset file input manually if needed
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      setLoading(false);
      loadBanners();
      alert("Banner published successfully!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this banner?")) {
      await BannerManagementAPI("delete", { id });
      loadBanners();
    }
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "30px" }}>
        
        {/* SIDEBAR FORM */}
        <div style={{ flex: "1 1 350px", maxWidth: "400px" }}>
          <div style={{ position: "sticky", top: "20px", backgroundColor: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "22px", fontWeight: "800" }}>Update Storefront</h2>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "25px" }}>Choose a slot and upload your visual.</p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "12px" }}>
              <button onClick={() => setUploadMode("file")} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px", backgroundColor: uploadMode === "file" ? "white" : "transparent" }}>UPLOAD</button>
              <button onClick={() => setUploadMode("url")} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px", backgroundColor: uploadMode === "url" ? "white" : "transparent" }}>URL</button>
            </div>

            {uploadMode === "file" ? (
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} style={{ marginBottom: "20px", width: "100%", fontSize: "13px" }} />
            ) : (
              <input placeholder="Paste direct image link..." value={directUrl} onChange={(e) => setDirectUrl(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px", boxSizing: "border-box" }} />
            )}

            <label style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px" }}>SELECT BANNER SLOT</label>
            <select value={bannerType} onChange={(e) => setBannerType(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "8px", marginBottom: "25px", fontWeight: "600", cursor: "pointer" }}>
              <option value="banner1">Banner 1 (Hero)</option>
              <option value="banner2">Banner 2 (Promotion)</option>
            </select>

            <button onClick={handleAddBanner} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", backgroundColor: "#4f46e5", color: "#fff", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}>
              {loading ? "Processing..." : "Publish Banner"}
            </button>
          </div>
        </div>

        {/* MAIN DISPLAY */}
        <div style={{ flex: "2 1 600px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px" }}>
            {banners.map((banner) => (
              <div key={banner._id} style={{ backgroundColor: "white", borderRadius: "28px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <div style={{ position: "relative", height: "320px" }}>
                  <img src={banner.imageLink} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "white", padding: "6px 14px", borderRadius: "12px", fontSize: "12px", fontWeight: "900", color: "#4f46e5", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                    {banner.bannerType === "banner1" ? "SLOT 1" : "SLOT 2"}
                  </div>
                </div>
                <div style={{ padding: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "800", fontSize: "18px" }}>Active Asset</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Updated: {new Date().toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDelete(banner._id)} style={{ padding: "12px 24px", borderRadius: "12px", border: "none", backgroundColor: "#fee2e2", color: "#ef4444", fontWeight: "bold", cursor: "pointer" }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {banners.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px", backgroundColor: "#fff", borderRadius: "28px", border: "2px dashed #e2e8f0" }}>
              <p style={{ color: "#94a3b8", fontWeight: "600" }}>Your storefront is empty. Add Banner 1 or 2.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BannerManagement;