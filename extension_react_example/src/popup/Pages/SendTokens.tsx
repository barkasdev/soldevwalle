import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const SendTokens: React.FC = () => {
  const [fromPubkey, setFromPubkey] = useState('');
  const [toPubkey, setToPubkey] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Get default "from" pubkey from selected wallet
  useEffect(() => {
    chrome.storage.local.get(['selectedWallet'], (result) => {
      if (result?.selectedWallet) {
        setFromPubkey(result.selectedWallet.pubkey);
      }
    });
  }, []);


  const handleSend = () => {
    if (!fromPubkey || !toPubkey || !amount || !password) {
      setStatus('error');
      setMessage('Please fill in all fields.');
      return;
    }

    setStatus('loading');
    setMessage('Sending SOL...');

    chrome.runtime.sendMessage(
      {
        type: 'SEND_SOL',
        from_pubkey: fromPubkey,
        to_pubkey: toPubkey,
        amount: parseFloat(amount),
        wallet_store_password: password,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          setStatus('error');
          setMessage(`Error: ${chrome.runtime.lastError.message}`);
          return;
        }

        if (response?.success) {
          setStatus('success');
          setMessage('Transaction successful!');
        } else {
          setStatus('error');
          setMessage(`Transaction failed: ${response?.message || 'Unknown error'}`);
        }
      }
    );
  };

  const handleBack = () => {
    chrome.storage.local.get(["selectedWallet", "selectedNetwork"], (result) => {
      if (result.selectedWallet) {
        chrome.storage.local.set({ selectedWallet: result.selectedWallet });
      }
      if (result.selectedNetwork) {
        chrome.storage.local.set({ selectedNetwork: result.selectedNetwork });
      }

      navigate("/wallet");
    });
  };

  return (
    <div className="container flex flex-col items-center text-white p-4">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 bg-gray-900 p-4 flex justify-between items-center z-10">
        <FaBars className="text-2xl" />
        <span className="font-semibold">Send Tokens</span>
        <FaSearch className="text-2xl" />
      </div>

      <div className="pt-16 text-center">
        <h1 className="text-2xl font-bold">Send SOL</h1>
      </div>

      {/* Input Fields */}
      <div className="w-full flex flex-col mt-6 gap-4 px-4">
        <input
          type="text"
          value={fromPubkey}
          onChange={(e) => setFromPubkey(e.target.value)}
          placeholder="Sender's public key"
          className="p-2 rounded bg-white/10 text-white placeholder-gray-400 outline-none"
        />
        <input
          type="text"
          value={toPubkey}
          onChange={(e) => setToPubkey(e.target.value)}
          placeholder="Recipient's public key"
          className="p-2 rounded bg-white/10 text-white placeholder-gray-400 outline-none"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (SOL)"
          className="p-2 rounded bg-white/10 text-white placeholder-gray-400 outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Wallet password"
          className="p-2 rounded bg-white/10 text-white placeholder-gray-400 outline-none"
        />

        <button
          onClick={handleSend}
          disabled={status === 'loading'}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Send SOL'}
        </button>

        {message && (
          <div
            className={`text-sm mt-2 ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white'
              }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
        <button
          onClick={handleBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default SendTokens;
