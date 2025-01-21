import React from "react";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0c1d] text-white">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-6">
          To continue your journey, please sign in:
        </h2>
    <Link to="/wallet">
      <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
       Sign up with Github
      </button>
    </Link>
        <p className="mt-6 text-sm text-gray-400">
          Do not have an account?{" "}
          <a href="#" className="text-white underline hover:text-orange-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
