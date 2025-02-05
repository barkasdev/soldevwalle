import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar: React.FC = () => {
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null); // Ref for detecting outside clicks

    // Close search bar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }
        };

        if (showSearch) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSearch]);

    return (
        <div className="relative">
            {/* Search Icon with Hover Effect */}
            <FaSearch
                className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setShowSearch(!showSearch)}
            />

            {/* Search Bar (Dropdown) */}
            {showSearch && (
                <div className="absolute right-0 top-10 bg-white/10 p-2 rounded-lg shadow-md w-48">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent border border-white/20 rounded-md px-3 py-1 text-white outline-none"
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;
