import React from "react";

const OfflinePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">You are Offline</h1>
        <p className="mt-4 text-lg text-gray-700">
          It seems you have lost your internet connection. Please check your
          network settings and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default OfflinePage;
