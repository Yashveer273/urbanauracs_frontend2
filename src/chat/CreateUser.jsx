import React, { useState } from "react";
import { createUser } from "./userController";


const CreateUser = () => {
  const [form, setForm] = useState({
    _id: "",
    mobileNumber: "",
    username: "",
    location: ""
  });

  const handleSubmit = async () => {
    if (!form._id) {
      alert("User ID is required");
      return;
    }

    await createUser(
      form._id,
      form.mobileNumber,
      form.username,
      form.location
    );

    alert("User Created Successfully");

    setForm({
      _id: "",
      mobileNumber: "",
      username: "",
      location: ""
    });
  };

  return (
    <div className="create-user">
      <input
        placeholder="User ID"
        value={form._id}
        onChange={e => setForm({...form, _id: e.target.value})}
      />

      <input
        placeholder="Mobile"
        value={form.mobileNumber}
        onChange={e => setForm({...form, mobileNumber: e.target.value})}
      />

      <input
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({...form, username: e.target.value})}
      />

      <input
        placeholder="Location"
        value={form.location}
        onChange={e => setForm({...form, location: e.target.value})}
      />

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateUser;