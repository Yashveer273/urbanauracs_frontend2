import React, {
  useEffect,
  useState,
} from "react";

import {
  fetchdashAuth,
  createDashAuth,
  updateDashAuth,
  deleteDashAuth,
  changeDashAuthPassword,
} from "../dashboardApi";

const ACCESS_TAGS = [
  "Users",
  "Sales",
  "Services",
  "Website Content",
  "Ticket",
  "Vendors Section",
  "Coupon Manager",
  "Notification",
  "Xl File Manager",
  "Banner",
  "Chat Box",
];

const DashboardContrller = () => {
  /*
  |--------------------------------------------------------------------------
  | Account form state
  |--------------------------------------------------------------------------
  */

  const [userId, setUserId] = useState("");
  const [password, setPassword] =
    useState("");

  const [
    ResponsiblePersonName,
    setResponsiblePersonName,
  ] = useState("");

  const [selectedTags, setSelectedTags] =
    useState([]);

  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isFetching, setIsFetching] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Admin password form state
  |--------------------------------------------------------------------------
  */

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Message state
  |--------------------------------------------------------------------------
  */

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Show message
  |--------------------------------------------------------------------------
  */

  const showMessage = (text, type) => {
    setMessage({
      text,
      type,
    });

    window.setTimeout(() => {
      setMessage({
        text: "",
        type: "",
      });
    }, 5000);
  };

  /*
  |--------------------------------------------------------------------------
  | Message styling
  |--------------------------------------------------------------------------
  */

  const getMessageClass = () => {
    if (message.type === "success") {
      return "bg-green-100 text-green-800 border-green-200";
    }

    if (message.type === "info") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }

    return "bg-red-100 text-red-800 border-red-200";
  };

  /*
  |--------------------------------------------------------------------------
  | Reset create/update form
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setUserId("");
    setPassword("");
    setResponsiblePersonName("");
    setSelectedTags([]);
    setIsEditing(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch users
  |--------------------------------------------------------------------------
  */

  const fetchUsers = async () => {
    try {
      setIsFetching(true);

      const response =
        await fetchdashAuth();

      /*
       * Updated backend returns:
       *
       * {
       *   success: true,
       *   users: [...]
       * }
       */
      setUsers(
        Array.isArray(response.data?.users)
          ? response.data.users
          : [],
      );
    } catch (error) {
      console.error(
        "Failed to fetch dashboard users:",
        error,
      );

      showMessage(
        error.response?.data?.message ||
          "Failed to fetch dashboard users.",
        "error",
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handle access tag
  |--------------------------------------------------------------------------
  */

  const handleTagChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedTags((previousTags) => [
        ...previousTags,
        value,
      ]);
    } else {
      setSelectedTags((previousTags) =>
        previousTags.filter(
          (tag) => tag !== value,
        ),
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create or update dashboard account
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId.trim()) {
      showMessage(
        "User ID cannot be empty.",
        "error",
      );
      return;
    }

    if (
      !ResponsiblePersonName.trim() &&
      !isEditing
    ) {
      showMessage(
        "Responsible person name is required.",
        "error",
      );
      return;
    }

    if (!password.trim() && !isEditing) {
      showMessage(
        "Password cannot be empty.",
        "error",
      );
      return;
    }

    if (
      !isEditing &&
      password.trim().length < 6
    ) {
      showMessage(
        "Password must contain at least 6 characters.",
        "error",
      );
      return;
    }

    if (selectedTags.length === 0) {
      showMessage(
        "Please select at least one access tag.",
        "error",
      );
      return;
    }

    try {
      setIsSaving(true);

      if (isEditing) {
        await updateDashAuth(
          userId,
          selectedTags.join(","),
        );

        showMessage(
          `Permissions for ${userId} updated successfully.`,
          "success",
        );
      } else {
        await createDashAuth({
          id: userId.trim(),
          pass: password,
          tagAccess:
            selectedTags.join(","),
          ResponsiblePersonName:
            ResponsiblePersonName.trim(),
        });

        showMessage(
          `Account ${userId} created successfully.`,
          "success",
        );
      }

      resetForm();
      await fetchUsers();
    } catch (error) {
      console.error(
        "Error saving dashboard account:",
        error,
      );

      showMessage(
        error.response?.data?.message ||
          "Failed to save dashboard account.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Edit permissions
  |--------------------------------------------------------------------------
  */

  const handleEdit = (user) => {
    setUserId(user.id || "");

    setResponsiblePersonName(
      user.ResponsiblePersonName || "",
    );

    setSelectedTags(
      String(user.tagAccess || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    );

    setPassword("");
    setIsEditing(true);

    showMessage(
      `Editing permissions for ${user.id}`,
      "info",
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Delete account
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${id}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDashAuth(id);

      showMessage(
        `Account ${id} deleted successfully.`,
        "success",
      );

      await fetchUsers();
    } catch (error) {
      console.error(
        "Failed to delete dashboard account:",
        error,
      );

      showMessage(
        error.response?.data?.message ||
          "Failed to delete dashboard account.",
        "error",
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Change logged-in admin password
  |--------------------------------------------------------------------------
  */

  const handleChangePassword = async (
    event,
  ) => {
    event.preventDefault();

    if (
      !oldPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      showMessage(
        "Old password, new password and confirm password are required.",
        "error",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage(
        "New password and confirm password do not match.",
        "error",
      );
      return;
    }

    if (newPassword.length < 6) {
      showMessage(
        "New password must contain at least 6 characters.",
        "error",
      );
      return;
    }

    if (oldPassword === newPassword) {
      showMessage(
        "New password cannot be the same as the old password.",
        "error",
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response =
        await changeDashAuthPassword({
          oldPassword,
          newPassword,
          confirmPassword,
        });

      const replacementToken =
        response.data?.token;

      if (!replacementToken) {
        throw new Error(
          "Replacement token was not returned.",
        );
      }

      /*
       * Replace old JWT after password update.
       */
      localStorage.setItem(
        "urbanauraservicesdashauthToken",
        replacementToken,
      );

      if (response.data?.user?.tagAccess) {
        localStorage.setItem(
          "urbanauraservicesdashtagAccess",
          response.data.user.tagAccess,
        );
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showMessage(
        "Admin password updated successfully.",
        "success",
      );
    } catch (error) {
      console.error(
        "Failed to change password:",
        error,
      );

      /*
       * Old password incorrect returns 401,
       * but the API interceptor does not remove
       * the token unless valid:false is returned.
       */
      showMessage(
        error.response?.data?.message ||
          "Unable to update password.",
        "error",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased sm:p-8">
      {/* Message */}

      {message.text && (
        <div
          className={`fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-lg border px-6 py-3 text-center shadow-lg ${getMessageClass()}`}
        >
          {message.text}
        </div>
      )}

      {/* Heading */}

      <div className="my-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
          Dashboard Access Controller
        </h1>

        <p className="mt-2 text-gray-500">
          Manage dashboard accounts and
          permissions.
        </p>
      </div>

      {/* Create and update account */}

      <div className="mx-auto mb-8 rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          {isEditing
            ? "Edit User Permissions"
            : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="userIdInput"
                className="mb-2 block font-medium text-gray-700"
              >
                User ID
              </label>

              <input
                type="text"
                id="userIdInput"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:ring-2 focus:ring-purple-800"
                placeholder="Enter unique user ID"
                value={userId}
                onChange={(event) =>
                  setUserId(
                    event.target.value,
                  )
                }
                disabled={isEditing}
                required
              />
            </div>

            <div>
              <label
                htmlFor="responsiblePersonName"
                className="mb-2 block font-medium text-gray-700"
              >
                Responsible Person Name
              </label>

              <input
                type="text"
                id="responsiblePersonName"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:ring-2 focus:ring-purple-800"
                placeholder="Enter responsible person name"
                value={ResponsiblePersonName}
                onChange={(event) =>
                  setResponsiblePersonName(
                    event.target.value,
                  )
                }
                disabled={isEditing}
                required={!isEditing}
              />
            </div>
          </div>

          {!isEditing && (
            <div className="mt-4">
              <label
                htmlFor="passwordInput"
                className="mb-2 block font-medium text-gray-700"
              >
                Password
              </label>

              <input
                type="password"
                id="passwordInput"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:ring-2 focus:ring-purple-800"
                placeholder="Enter password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                minLength={6}
                autoComplete="new-password"
                required
              />
            </div>
          )}

          <div className="mt-6">
            <label className="mb-3 block font-medium text-gray-700">
              Select Access Tags
            </label>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {ACCESS_TAGS.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-gray-700"
                >
                  <input
                    type="checkbox"
                    value={tag}
                    checked={selectedTags.includes(
                      tag,
                    )}
                    onChange={
                      handleTagChange
                    }
                    className="h-5 w-5 rounded text-purple-800"
                  />

                  <span className="text-sm">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 w-full rounded-lg bg-purple-800 px-4 py-3 font-bold text-white transition hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Update Permissions"
                : "Save User"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isSaving}
              className="mt-3 w-full rounded-lg bg-gray-400 px-4 py-3 font-bold text-white transition hover:bg-gray-500"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Change logged-in admin password */}

      <div className="mx-auto mb-8 rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-700">
          Change Admin Password
        </h2>

        <p className="mb-6 mt-2 text-sm text-gray-500">
          The current password is required.
          After the password changes, the new
          JWT will replace the old JWT.
        </p>

        <form
          onSubmit={handleChangePassword}
          className="grid gap-4 lg:grid-cols-3"
        >
          <div>
            <label
              htmlFor="oldPassword"
              className="mb-2 block font-medium text-gray-700"
            >
              Old Password
            </label>

            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(event) =>
                setOldPassword(
                  event.target.value,
                )
              }
              placeholder="Enter old password"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-purple-800"
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block font-medium text-gray-700"
            >
              New Password
            </label>

            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value,
                )
              }
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-purple-800"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-medium text-gray-700"
            >
              Confirm New Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-purple-800"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-3"
          >
            {changingPassword
              ? "Updating Password..."
              : "Update Admin Password"}
          </button>
        </form>
      </div>

      {/* User table */}

      <div className="mx-auto rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-700">
            Current User Permissions
          </h2>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={isFetching}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-60"
          >
            {isFetching
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  User ID
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Responsible Person
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Access Tags
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="transition hover:bg-purple-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {user.id}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {user.ResponsiblePersonName ||
                        "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.tagAccess}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(user)
                        }
                        className="mr-4 text-purple-800 hover:text-purple-950"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            user.id,
                          )
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {isFetching
                      ? "Loading users..."
                      : "No users found."}
                  </td>
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