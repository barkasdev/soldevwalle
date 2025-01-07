import React from 'react';


import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import WalletPage from './Pages/WalletPage';
import SettingsPage from './Pages/SettingsPage';

const App: React.FC = () => {
  return (
    <div className="h-[450px] w-[300px] bg-gray-100 mx-auto">
      <Router>
        <nav className="bg-blue-500 p-4 text-white">
          <ul className="flex justify-around">
            <li>
              <Link to="/">Home</Link>
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
  );
};

export default App;
