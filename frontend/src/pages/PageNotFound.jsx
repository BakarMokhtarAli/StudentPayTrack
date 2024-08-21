import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa"; // Importing an icon for the page not found
import { Button } from "@/components/ui/button";

export const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <FaExclamationTriangle className="text-6xl text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-2 text-lg text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <Button
        onClick={() => navigate(-1)}
        className="mt-6 text-white py-2 px-4 rounded-lg"
      >
        Go Back
      </Button>
    </div>
  );
};
