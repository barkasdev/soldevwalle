import React from 'react';
import { Link } from 'react-router-dom';
import AccountDropdown from '../Components/AccountDropdown';
import SearchBar from '../Components/Searchbar';
import { FaBars } from 'react-icons/fa';


const transactions = [
    { section: 'Recent activity', items: 3 },
    { section: 'Last week', items: 3 },
    { section: 'A Month ago', items: 3 },
    { section: 'Long time ago', items: 3 },
];

const TransactionHistory: React.FC = () => {
    return (
        <div className="flex flex-col items-center text-white p-4 overflow-y-auto h-screen no-scrollbar">
            {/* Wallet Header */}
            <div className="w-full fixed top-0 left-0 p-4 flex justify-between items-center z-10">
                {/* Menu Icon with Hover Effect */}
                <FaBars
                    className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => console.log("Menu clicked")}
                />

                {/* Account Dropdown */}
                <AccountDropdown />

                {/* Search Bar Component */}
                <SearchBar />
            </div>


            <h1 className="text-2xl font-bold mt-16">Transaction history</h1>

            {transactions.map((section, index) => (
                <div key={index} className="w-full mt-8">
                    <h2 className="text-lg font-semibold text-center">{section.section}</h2>
                    <div className="flex flex-col gap-2 mt-4">
                        {[...Array(section.items)].map((_, i) => (
                            <div key={i} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                                <span className="text-xs font-semibold">TRANSACTION SIGNATURE</span>
                                <span className="text-xs">BLOCK</span>
                                <span className="text-xs">AGE</span>
                                <span className="text-xs">TIMESTAMP</span>
                                <span className="text-xs">RESULT</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Back Button */}
            <div className="w-full flex justify-center mt-6 mb-4">
                <Link to="/wallet" className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600">
                    Back
                </Link>
            </div>
        </div>
    );
};

export default TransactionHistory;