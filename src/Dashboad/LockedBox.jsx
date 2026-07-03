import React from "react";

/**
 * LockedBox - A professional full-screen access restriction state.
 * @param {string} label - The main title, fixed from the parent.
 * @param {string} message - A secondary supporting description.
 * @param {React.ReactNode} icon - Optional custom icon override.
 */
const LockedBox = ({
  label = "Access Restricted",
  message = "You do not have the necessary permissions to view this content. Please contact your administrator for permission.",
  icon = null,
}) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50/50 p-6">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Icon Container */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {icon || (
            <svg
              className="h-10 w-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-slate-900">{label}</h2>
        <p className="mt-3 max-w-sm text-slate-600">{message}</p>

        {/* Optional: Add a call to action if needed */}
        <button className="mt-8 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 active:scale-95">
          Access restrict
        </button>
      </div>
    </div>
  );
};

export default LockedBox;
