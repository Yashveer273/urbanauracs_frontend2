import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseCon";
import UserDashboard from "./UserDashboard";

const UserLogin = () => {
  const [userId, setUserId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!userId) return;

    try {
      const userRef = doc(firestore, "testusers", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setCurrentUser({ _id: userId, ...userSnap.data() });
        setError("");
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error(err);
      setError("Login error");
    }
  };

  // If logged in → show dashboard
  if (currentUser) {
    return <UserDashboard currentUser={currentUser} />;
  }

  return (
    <div className="login-container">
      <h2>Login with User ID</h2>

      <input
        type="text"
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button onClick={handleLogin}>Open Account</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserLogin;