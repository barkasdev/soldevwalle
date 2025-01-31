import React from "react";
import { Link } from "react-router-dom";
const SignUpPage: React.FC = () => {
    return (
        <div className="bg-[#0b0b20] flex flex-col items-center justify-center text-white p-4">
            <p className="text-lg text-center mb-6">To continue your journey, <br /> please sign up:</p>
            <Link to="/wallet">
                <button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    Sign up with Github
                </button>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
                Already have an account?
                <Link to="/" className="text-white font-medium cursor-pointer hover:underline ml-2">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default SignUpPage;