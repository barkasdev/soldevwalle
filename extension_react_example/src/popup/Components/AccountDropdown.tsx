/* eslint-disable */
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Wallet {
    name: string;
    pubkey: string;
}

interface Props {
    onWalletSelect?: (walletName: string) => void; //  Callback function
}

const AccountDropdown: React.FC<Props> = ({ onWalletSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    useEffect(() => {
        // Fetch wallets from background.js
        chrome.runtime.sendMessage({ type: "GET_WALLETS" }, (response) => {
            if (response && response.wallets) {
                console.log("AccountDropdown - Received Wallets:", response.wallets);
                setWallets(response.wallets);
                if (response.wallets.length > 0) {
                    setSelectedWallet(response.wallets[0]); // Default to first wallet
                    if (onWalletSelect) onWalletSelect(response.wallets[0].name); //  Notify WalletPage
                }
            } else {
                console.error("AccountDropdown - No Wallets Received");
            }
        });
    }, []);

    const handleWalletSelect = (wallet: Wallet) => {
        setSelectedWallet(wallet);
        setIsOpen(false);
        if (onWalletSelect) onWalletSelect(wallet.name); // Notify WalletPage
        chrome.storage.local.set({ selectedWallet: wallet });
    };

    return (
        <div className="relative">
            {/* Selected Wallet Display */}
            <div
                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-white/10 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-8 h-8 rounded-full bg-orange-400" />
                <span className="font-semibold">{selectedWallet ? selectedWallet.name : "Select Wallet"}</span>
                <FaChevronDown className="text-sm" />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg overflow-hidden z-20">
                    <ul className="text-sm">
                        {wallets.map((wallet) => (
                            <li
                                key={wallet.pubkey}
                                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                                    selectedWallet?.pubkey === wallet.pubkey ? "font-bold bg-gray-700" : ""
                                }`}
                                onClick={() => handleWalletSelect(wallet)}
                            >
                                {wallet.name} 
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AccountDropdown;
