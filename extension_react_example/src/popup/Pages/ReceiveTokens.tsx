import React from 'react'
import { FaSearch, FaBars } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ReceiveTokens: React.FC = () => {
  // Mock token transactions
  const receivedTokens = [
    { id: 1, name: 'Solana', symbol: 'SOL', amount: '0.0007 SOL', sender: '*Sender*', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { id: 2, name: 'Bitcoin', symbol: 'BTC', amount: '0.0007 BTC', sender: '*Sender*', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { id: 3, name: 'Ethereum', symbol: 'ETH', amount: '0.0007 ETH', sender: '*Sender*', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { id: 4, name: 'Solana', symbol: 'SOL', amount: '0.0007 SOL', sender: '*Sender*', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  ]

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
        <h1 className="text-2xl font-bold">Receive tokens</h1>
      </div>

      {/* Token List */}
      <div className="w-full flex flex-col mt-4 gap-2">
        {receivedTokens.map((token) => (
          <div key={token.id} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={token.logo} alt={token.name} className="w-6 h-6" />
              <div>
                <p className="font-semibold">{token.name}</p>
                <p className="text-xs text-gray-400">from {token.sender}</p>
              </div>
            </div>
            <p className="font-semibold">{token.amount}</p>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
        <Link
          to="/wallet" // Replace with the desired path
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back
        </Link>
      </div>
    </div>
  )
}

export default ReceiveTokens