import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardContrller = () => {
  // --- State Variables ---
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);

  // --- Helper Functions ---
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const resetForm = () => {
    setUserId('');
    setPassword('');
    setSelectedTags([]);
    setIsEditing(false);
  };

  // --- Fetch Users ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/get-dashAuth');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      showMessage('Failed to fetch users.', 'error');
    }
  };

  // --- Event Handlers ---
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTags([...selectedTags, value]);
    } else {
      setSelectedTags(selectedTags.filter(tag => tag !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      showMessage("User ID cannot be empty.", 'error');
      return;
    }

    if (!password.trim() && !isEditing) {
      showMessage("Password cannot be empty.", 'error');
      return;
    }

    if (selectedTags.length === 0) {
      showMessage("Please select at least one access tag.", 'error');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/update-dashAuth/${userId}`, {
          tags: selectedTags.join(","),
        });
        showMessage(`Permissions for ${userId} updated successfully!`, 'success');
      } else {
        await axios.post('http://localhost:8000/api/create-dashAuth', {
          id: userId,
          pass: password,
          tagAccess: selectedTags.join(","),
        });
        showMessage(`Permissions for ${userId} created successfully!`, 'success');
      }

      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      showMessage("Failed to save permissions. Check console for details.", 'error');
    }
  };

  const handleEdit = (user) => {
    setUserId(user.id);
    setSelectedTags(user.tagAccess.split(",")); // backend stores as string
    setIsEditing(true);
    showMessage(`Now editing permissions for user: ${user.id}`, 'info');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-dashAuth/${id}`);
      showMessage(`Permissions for ${id} deleted successfully!`, 'success');
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showMessage("Failed to delete permissions. Check console for details.", 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased">
      {/* Main Heading */}
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Access Controller</h1>
        <p className="text-gray-500 mt-2">Manage user permissions in real-time.</p>
      </div>

      {/* Message Box */}
      {message.text && (
        <div className={`
          fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50
          ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {message.text}
        </div>
      )}

      {/* Add/Update User Form */}
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">{isEditing ? "Edit User Permissions" : "Add New User"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userIdInput" className="block text-gray-700 font-medium mb-2">User ID</label>
            <input
              type="text"
              id="userIdInput"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800 transition-colors"
              placeholder="Enter user ID (username-uniqueNumber)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isEditing}
              required
            />
          </div>
          {!isEditing && (
            <div className="mb-4">
              <label htmlFor="passwordInput" className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                id="passwordInput"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800 transition-colors"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Select Access Tags</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Users', 'Sales', 'Services', 'Website Content', 'Ticket'].map(tag => (
                <label key={tag} className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="checkbox"
                    name="tag"
                    value={tag}
                    className="form-checkbox h-5 w-5 text-purple-800 rounded-md transition-colors"
                    checked={selectedTags.includes(tag)}
                    onChange={handleTagChange}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-800">
            {isEditing ? "Update Permissions" : "Save Permissions"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* User Access Table */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Current User Permissions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access Tags</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.tagAccess}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(user)} className="text-purple-800 hover:text-purple-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500 italic">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContrller;
