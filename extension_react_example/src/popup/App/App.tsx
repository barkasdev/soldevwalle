import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WalletPage from '../Pages/WalletPage'
import SettingsPage from '../Pages/SettingsPage'
import SignInPage from '../Pages/SignInPage'
import SignUpPage from '../Pages/SignUpPage'
import SendTokens from '../Pages/SendTokens'
import ReceiveTokens from '../Pages/ReceiveTokens'

const App: React.FC = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path= "/sendTokens" element={<SendTokens />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/receiveTokens" element={<ReceiveTokens />} />
      </Routes>
    </div>
  )
}

export default App
