import React from "react";
import { Link } from "react-router-dom";


const SendTokens = () => {
    return (
        <div className="min-h-screen bg-[#0d0c1d] text-white flex flex-col justify-between">
            {/* Navbar */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#0b091a] shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                        <span className="font-bold text-black">A</span>
                    </div>
                    <span className="font-medium">Account 1</span>
                </div>
                <button className="text-xl text-gray-400 hover:text-white">🔍</button>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center px-6">
                <h1 className="text-2xl font-semibold mb-6">Send tokens</h1>
                {/* Recipient Input */}
                <input
                    type="text"
                    placeholder="Recipient"
                    className="w-full px-4 py-3 mb-4 bg-[#1a162a] border border-[#2c273d] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <div className="flex items-center bg-[#1a162a] rounded-lg border border-[#2c273d] focus-within:ring-2 focus-within:ring-orange-400">
                    {/* Amount Input */}
                    <input
                        type="text"
                        placeholder="Amount"
                        className="flex-1 px-4 py-3 bg-transparent text-white rounded-l-lg focus:outline-none"
                    />
                    {/* Dropdown */}
                    <select
                        className="px-4 py-3 bg-transparent text-white rounded-r-lg border-l border-[#2c273d] focus:outline-none"
                    >
                        <option value="SOL">SOL</option>
                        <option value="ETH">ETH</option>
                        <option value="BTC">BTC</option>
                    </select>
                </div>
                 

                {/* Balance */}
                <p className="text-sm text-gray-400 mt-2">Your balance: "amount here" SOL</p>

                {/* Buttons */}
                <div className="flex justify-between w-full mt-8">
                    <Link to="/wallet">
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium shadow-md hover:scale-105 transition-transform duration-300 mr-2">
                        Back
                    </button>
                    </Link>
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg text-black font-medium shadow-md hover:scale-105 transition-transform duration-300 ml-2">
                        Next
                    </button>
                </div>
            </div>

            {/* Footer with Wavy Design */}
            <div className="relative">
                {/* Wavy SVG */}
                <div className="absolute top-0 left-0 right-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        className="w-full h-16"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="url(#orangeGradient)"
                            fillOpacity="1"
                            d="M0,160L40,186.7C80,213,160,267,240,277.3C320,288,400,256,480,234.7C560,213,640,203,720,213.3C800,224,880,256,960,245.3C1040,235,1120,181,1200,170.7C1280,160,1360,192,1400,208L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                        />
                        <defs>
                            <linearGradient id="orangeGradient" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#ff7f00" />
                                <stop offset="100%" stopColor="#ffc300" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Footer */}
                <div className="bottom-0 left-0 right-0 bg-gradient-to-r from-orange-400 to-yellow-400 py-3 flex flex-col justify-between relative z-10">
                    <div className="flex justify-around text-black">
                        <button className="flex flex-col items-center">
                            <span>🏠</span>
                            <span className="text-sm">Home</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <span>📈</span>
                            <span className="text-sm">Stats</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <span>⚙️</span>
                            <span className="text-sm">Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendTokens;
