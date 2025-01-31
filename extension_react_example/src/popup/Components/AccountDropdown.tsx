import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const AccountDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Account Display (Clickable Dropdown Trigger) */}
      <div
        className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-white/10 transition"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="w-8 h-8 rounded-full bg-orange-400" />
        <span className="font-semibold">Account 1</span>
        <FaChevronDown className="text-sm" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg overflow-hidden z-20"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul className="text-sm">
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Account 1</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Account 2</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Account 3</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AccountDropdown