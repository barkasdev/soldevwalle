import React from 'react'
import '../../index.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import WalletPage from '../Pages/WalletPage'
import SettingsPage from '../Pages/SettingsPage'
import initWasmModule, { init_wasm, report_state } from '../../utils/wasm/wasm_mod'

const App: React.FC = () => {
  ;(async () => {
    await initWasmModule()
    init_wasm() // this call logs a hello message from WASM for demo purposes
    // report_state('init')
  })()
  const test = () => {
    console.log('huy')
  }

  return (
    <div className="h-[450px] w-[300px] bg-gray-100 mx-auto">
      <Router>
        <nav className="bg-blue-500 p-4 text-white">
          <ul className="flex justify-around">
            <li>
              <button onClick={() => test()}>Homse</button>
            </li>
            <li>
              <Link to="/wallet">Wallet</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" Component={HomePage} />
            <Route path="/wallet" Component={WalletPage} />
            <Route path="/settings" Component={SettingsPage} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
