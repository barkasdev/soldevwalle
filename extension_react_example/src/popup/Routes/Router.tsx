import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SettingsPage from '../Pages/SettingsPage';
import WalletPage from '../Pages/WalletPage';
import SignInPage from '../Pages/SignInPage';
import SendTokens from '../Pages/SendTokens';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <div className="p-4">
                {/* <Navbar /> */}

                <Routes>
                    <Route path="/" element={<SignInPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path= "/sendTokens" element={<SendTokens />} />
                </Routes>
            </div>
        </Router>
    );
};

export default AppRouter;
