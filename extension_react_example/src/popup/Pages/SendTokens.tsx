import React from 'react'
import { FaSearch, FaBars, FaPaperPlane } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const SendTokensPage: React.FC = () => {
  return (
    <div className="container flex flex-col items-center text-white p-4">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 bg-gray-900 p-4 flex justify-between items-center z-10">
        <FaBars className="text-2xl" />
        <span className="font-semibold">Send Tokens</span>
        <FaSearch className="text-2xl" />
      </div>

      {/* Content */}
      <div className="pt-16 text-center flex flex-col items-center gap-4">
        {/* Send Icon */}
        <FaPaperPlane className="text-5xl text-white" />

        {/* Amount */}
        <h1 className="text-3xl font-bold">0.0008 SOL</h1>

        {/* Transaction Details */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-lg">
            <span className="text-gray-400">To</span>
            <span className="font-medium italic">*Recipient*</span>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <span className="text-gray-400">Network</span>
            <span className="font-medium italic">*Network*</span>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <span className="text-gray-400 mr-2">Network Fee</span>
            <span className="font-medium"> 0.00001 SOL</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-between mt-6">
        <Link
          to="/wallet"
          className="w-[45%] text-center py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 shadow-md text-white font-bold hover:scale-105 transition-transform duration-200"
        >
          Back
        </Link>
        <button className="w-[45%] py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 shadow-md text-white font-bold hover:scale-105 transition-transform duration-200">
          Next
        </button>
      </div>
    </div>
  )
}

export default SendTokensPage

