/* eslint-disable */
import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

interface Network {
    name: string;
    address: string;
    active: boolean;
}

interface Props {
    onNetworkSelect: (networkName: string) => void;
}

const NetworkDropdown: React.FC<Props> = ({ onNetworkSelect }) => {
    const [networks, setNetworks] = useState<Network[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [selectedNetwork, setSelectedNetwork] = useState<string>("");

    useEffect(() => {
        // Request networks from background.js
        chrome.runtime.sendMessage({ type: "GET_NETWORKS" }, (response) => {
            if (response && response.networks) {
                console.log("WalletPage - Received Networks:", response.networks);
                setNetworks(response.networks);
                const activeNetwork = response.networks.find((net: { active: any; }) => net.active);
                if (activeNetwork) setSelectedNetwork(activeNetwork.name);
            } else {
                console.error("WalletPage - No Networks Received");
            }
        });
    }, []);

    const handleNetworkSelect = (networkName: string) => {
        const updatedNetworks = networks.map((net) => ({
            ...net,
            active: net.name === networkName,
        }));
    
        setNetworks(updatedNetworks);
        setSelectedNetwork(networkName);
        setDropdownOpen(false);
        onNetworkSelect(networkName);
    
        //  Send message to background to set active network
        chrome.runtime.sendMessage(
            {
                type: "SET_NETWORK",
                networkName: networkName, // pass the selected network
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("SET_NETWORK failed:", chrome.runtime.lastError.message);
                } else {
                    console.log("SET_NETWORK response:", response);
                }
            }
        );
    };
    

    return (
        <div className="relative">
            {/* Dropdown Toggle */}
            <FaBars
                className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {/* Selected Network */}
            <p className="text-xs text-gray-300 mt-1">{selectedNetwork || "Select Network"}</p>

            {/* Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                    {networks.map((network) => (
                        <button
                            key={network.name}
                            className={`block w-full text-left px-3 py-2 hover:bg-gray-200 ${
                                network.active ? "font-bold bg-gray-300" : ""
                            }`}
                            onClick={() => handleNetworkSelect(network.name)}
                        >
                            {network.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NetworkDropdown;
