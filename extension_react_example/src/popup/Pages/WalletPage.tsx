import React from "react";
import { Link } from "react-router-dom";

const WalletUI = () => {
  return (
    <div className="min-h-screen bg-[#0d0c1d] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          {/* Solana Dropdown */}
          <div className="relative group">
            <button className="flex items-center bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
              <img
                src="https://cryptologos.cc/logos/solana-sol-logo.png" // Example logo
                alt="Solana Logo"
                className="h-5 w-5 mr-2"
              />
              Solana
            </button>
            {/* Dropdown */}
            <div className="absolute hidden group-hover:block bg-white text-black rounded-md shadow-lg mt-2 w-40">
              <ul className="flex flex-col space-y-2 p-2">
                <li className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-md">
                  <img
                    src="https://cryptologos.cc/logos/solana-sol-logo.png" // Example logo
                    alt="Solana Logo"
                    className="h-5 w-5 mr-2"
                  />
                  Solana Testnet
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-md">
                  <img
                    src="https://cryptologos.cc/logos/solana-sol-logo.png" // Example logo
                    alt="Solana Logo"
                    className="h-5 w-5 mr-2"
                  />
                  Solana Devnet
                </li>
              </ul>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
              Account 1
            </button>
            {/* Dropdown */}
            <div className="absolute hidden group-hover:block bg-white text-black rounded-md shadow-lg mt-2 w-40">
              <ul className="flex flex-col space-y-2 p-2">
                <li className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-md">
                  Account 1
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-md">
                  Account 2
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-md">
                  Account 3
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12h2m-6 0h.01m-2 0h.01m2 0a2 2 0 110 4m0-4a2 2 0 100-4m2 0a2 2 0 110 4m0-4a2 2 0 100-4"
            />
          </svg>
        </button>
      </header>

      {/* Balance Section */}
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold">$0.00</h1>
        <p className="text-sm text-gray-400 mt-2">+ $0.00 + 0.00%</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4 mb-6">
        <button className="flex flex-col items-center bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-4 py-3 rounded-lg shadow-md hover:scale-105 transition-transform">
          <span>Receive</span>
        </button>
        <Link to="/sendTokens">
          <button className="flex flex-col items-center bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-4 py-3 rounded-lg shadow-md hover:scale-105 transition-transform">
            Send
          </button>
        </Link>
        <button className="flex flex-col items-center bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-4 py-3 rounded-lg shadow-md hover:scale-105 transition-transform">
          <span>Drop</span>
        </button>
      </div>

      {/* Assets List */}
      <div className="space-y-4 px-4">
        {/* Solana */}
        <div className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src="https://cryptologos.cc/logos/solana-sol-logo.png"
              alt="Solana Logo"
              className="h-6 w-6"
            />
            <span className="font-medium">Solana</span>
          </div>
          <div className="text-right">
            <p className="text-sm">$0.00</p>
            <p className="text-xs text-gray-400">0 SOL</p>
          </div>
        </div>
        {/* Ethereum */}
        <div className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
              alt="Ethereum Logo"
              className="h-6 w-6"
            />
            <span className="font-medium">Ethereum</span>
          </div>
          <div className="text-right">
            <p className="text-sm">$0.00</p>
            <p className="text-xs text-gray-400">0 ETH</p>
          </div>
        </div>
        {/* Bitcoin */}
        <div className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
              alt="Bitcoin Logo"
              className="h-6 w-6"
            />
            <span className="font-medium">Bitcoin</span>
          </div>
          <div className="text-right">
            <p className="text-sm">$0.00</p>
            <p className="text-xs text-gray-400">0 BTC</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-r from-orange-400 to-yellow-400 py-3">
        <div className="flex justify-around">
          <button className="text-black">🏠</button>
          <button className="text-black">📊</button>
          <button className="text-black">➕</button>
          <button className="text-black">⚙️</button>
        </div>
      </footer>
    </div>
  );
};

export default WalletUI;
