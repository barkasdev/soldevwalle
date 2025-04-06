import React, { useState } from 'react'
import { FaSearch, FaBars } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ReceiveTokens: React.FC = () => {
  const [pubkey, setPubkey] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleAirdrop = () => {
    if (!pubkey || !amount || isNaN(parseFloat(amount))) {
      setMessage('Please enter a valid public key and amount.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setMessage('Requesting airdrop...')

    chrome.runtime.sendMessage(
      {
        type: 'REQUEST_AIRDROP',
        to_pubkey: pubkey,
        amount: parseFloat(amount),
      },
      (response) => {
        if (chrome.runtime.lastError) {
          setStatus('error')
          setMessage(`Error: ${chrome.runtime.lastError.message}`)
          return
        }

        if (response?.success) {
          setStatus('success')
          setMessage('Airdrop requested successfully!')
        } else {
          setStatus('error')
          setMessage(`Airdrop failed: ${response?.message || 'Unknown error'}`)
        }
      }
    )
  }

  return (
    <div className="container flex flex-col items-center text-white p-4">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 bg-gray-900 p-4 flex justify-between items-center z-10">
        <FaBars className="text-2xl" />
        <span className="font-semibold">Receive Tokens</span>
        <FaSearch className="text-2xl" />
      </div>

      {/* Title */}
      <div className="pt-16 text-center">
        <h1 className="text-2xl font-bold">Request Airdrop</h1>
      </div>

      {/* Input Fields */}
      <div className="w-full flex flex-col mt-6 gap-4 px-4">
        <input
          type="text"
          value={pubkey}
          onChange={(e) => setPubkey(e.target.value)}
          placeholder="Enter your wallet public key"
          className="p-2 rounded bg-white/10 text-white placeholder-gray-400 outline-none"
        />

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (SOL)"
          className="p-2 rounded bg-white/10 text-white placeholder-gray-400 outline-none"
        />

        <button
          onClick={handleAirdrop}
          disabled={status === 'loading'}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          {status === 'loading' ? 'Requesting...' : 'Request Airdrop'}
        </button>

        {message && (
          <div
            className={`text-sm mt-2 ${
              status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
        <Link
          to="/wallet"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back
        </Link>
      </div>
    </div>
  )
}

export default ReceiveTokens
