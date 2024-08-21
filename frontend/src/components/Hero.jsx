import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <header className="bg-slate-800 text-white p-8 text-center">
      <h1 className="text-4xl font-bold">Welcome to Student Payment Tracker</h1>
      <p className="mt-4 text-lg">
        Easily manage your students and their payment statuses.
      </p>
      <button className="mt-6 bg-white text-gray-600 py-2 px-4 rounded-lg font-semibold">
        <Link to={"/login"}>Get Started</Link>
      </button>
    </header>
  );
};

export default Hero;
