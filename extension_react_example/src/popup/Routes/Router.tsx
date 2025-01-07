import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SettingsPage from '../Pages/SettingsPage';
import WalletPage from '../Pages/WalletPage';
import Navbar from '../Components/Navbar/Navbar';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <div className="p-4">
                <Navbar />

                <Routes>
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default AppRouter;
