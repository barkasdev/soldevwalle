import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaHome, FaClock, FaUser } from 'react-icons/fa';
import AccountDropdown from '../Components/AccountDropdown';
import SearchBar from '../Components/Searchbar';
import { Link } from 'react-router-dom';
import initWasm ,{ get_networks_async } from '../../utils/wasm/wasm_mod';


const WalletPage: React.FC = () => {
    const [networks, setNetworks] = useState<{ networkName: string; address: string; active: boolean }[]>([]);
    const [selectedNetwork, setSelectedNetwork] = useState<string>("");   // Default selected network
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Toggle dropdown visibility

    useEffect(() => {
        const loadNetworks = async () => {
            await initWasm(); // Initialize WASM module
            const networkList = await get_networks_async();
            
            // Rename "name" property to "networkName"
            const formattedNetworks = networkList.map((net: { networkName: any; address: any; active: any; }) => ({
                networkName: net.networkName, 
                address: net.address,
                active: net.active
            }));

            setNetworks(formattedNetworks);

            // Set initially active network
            const activeNetwork = formattedNetworks.find((net: { active: any; }) => net.active);
            if (activeNetwork) setSelectedNetwork(activeNetwork.networkName);
        };

        loadNetworks();
    }, []);

    const handleNetworkSelect = (selectedNetworkName: string) => {
        const updatedNetworks = networks.map((net) => ({
            ...net,
            active: net.networkName === selectedNetworkName, // Set only the selected one to active
        }));

        setNetworks(updatedNetworks); // Update state
        setSelectedNetwork(selectedNetworkName); // Update displayed network
        setDropdownOpen(false); // Close dropdown
    };

    return (
        <div className="container flex flex-col items-center text-white p-4">
            {/* Header */}
            <div className="w-full fixed top-0 left-0 p-4 flex justify-between items-center z-10">
                {/* Left Side - Network Selector */}
                <div className="relative">
                    {/* Menu Icon with Dropdown Toggle */}
                    <FaBars
                        className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {/* Selected Network Display */}
                    <p className="text-xs text-gray-300 mt-1">{selectedNetwork || "Select Network"}</p>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                            {networks.map((network) => (
                                <button
                                    key={network.networkName}
                                    className={`block w-full text-left px-3 py-2 hover:bg-gray-200 ${
                                        network.active ? "font-bold bg-gray-300" : ""
                                    }`}
                                    onClick={() => handleNetworkSelect(network.networkName)}
                                >
                                    {network.networkName}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Account Dropdown */}
                <AccountDropdown />

                {/* Search Bar Component */}
                <SearchBar />
            </div>

            {/* Balance */}
            <div className="pt-6 text-center">
                <h1 className="text-5xl font-bold">$0.00</h1>
                <p className="text-sm text-gray-400 mt-2">+ $0.00 + 0.00%</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <Link to="/receiveTokens">
                    <button className="flex flex-col items-center px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 shadow-md 
                     hover:from-yellow-500 hover:to-orange-600 hover:scale-105 transition-transform duration-200">
                        <span className="text-sm font-bold">Receive</span>
                    </button>
                </Link>
                <Link to="/sendTokens">
                    <button className="flex flex-col items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 shadow-md 
                     hover:from-red-500 hover:to-pink-600 hover:scale-105 transition-transform duration-200">
                        <span className="text-sm font-bold">Send</span>
                    </button>
                </Link>
                <button className="flex flex-col items-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 shadow-md 
                     hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-transform duration-200">
                    <span className="text-sm font-bold">Drop</span>
                </button>
            </div>

            {/* Assets List */}
            <div className="w-full flex flex-col mt-4 gap-2">
                <div className="bg-white/10 rounded-lg p-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="Solana" className="w-6 h-6" />
                        <div>
                            <p className="font-semibold">Solana</p>
                            <p className="text-xs text-gray-400">0 SOL</p>
                        </div>
                    </div>
                    <p className="font-semibold">$0.00</p>
                </div>

                <div className="bg-white/10 rounded-lg p-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum" className="w-6 h-6" />
                        <div>
                            <p className="font-semibold">Ethereum</p>
                            <p className="text-xs text-gray-400">0 ETH</p>
                        </div>
                    </div>
                    <p className="font-semibold">$0.00</p>
                </div>

                <div className="bg-white/10 rounded-lg p-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" className="w-6 h-6" />
                        <div>
                            <p className="font-semibold">Bitcoin</p>
                            <p className="text-xs text-gray-400">0 BTC</p>
                        </div>
                    </div>
                    <p className="font-semibold">$0.00</p>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="w-full absolute bottom-0 bg-white/10 py-2 flex justify-around items-center">
                <FaHome
                    className="text-lg text-orange-400 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => console.log("Home clicked")}
                />
                <Link to="/transactionHistory">
                    <FaClock
                        className="text-lg text-gray-400 cursor-pointer hover:text-orange-400 hover:scale-110 transition-transform"
                        onClick={() => console.log("History clicked")}
                    />
                </Link>
                <FaUser
                    className="text-lg text-gray-400 cursor-pointer hover:text-orange-400 hover:scale-110 transition-transform"
                    onClick={() => console.log("Profile clicked")}
                />
            </div>

        </div>
    );
};

export default WalletPage;
