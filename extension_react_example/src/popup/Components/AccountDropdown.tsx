/* eslint-disable */
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Wallet {
    name: string;
    pubkey: string;
    account_info?: {
        balance?: number;
        tokens?: any;
    };
}

interface Props {
    wallets: Wallet[];
    selectedWallet: Wallet | null;
    onWalletSelect: (wallet: Wallet) => void;
}


const AccountDropdown: React.FC<Props> = ({ wallets, selectedWallet, onWalletSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleWalletSelect = (wallet: Wallet) => {
        setIsOpen(false);
        onWalletSelect(wallet);
        chrome.storage.local.set({ selectedWallet: wallet });
    };

    return (
        <div className="relative">
            <div
                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-white/10 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-8 h-8 rounded-full bg-orange-400" />
                <span className="font-semibold">{selectedWallet ? selectedWallet.name : "Select Wallet"}</span>
                <FaChevronDown className="text-sm" />
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg overflow-hidden z-20">
                    <ul className="text-sm">
                        {wallets.map((wallet) => (
                            <li
                                key={wallet.pubkey}
                                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${selectedWallet?.pubkey === wallet.pubkey ? "font-bold bg-gray-700" : ""
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

