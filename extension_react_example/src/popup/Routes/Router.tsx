import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SettingsPage from '../Pages/SettingsPage';
import WalletPage from '../Pages/WalletPage';
import SignInPage from '../Pages/SignInPage';
import SendTokens from '../Pages/SendTokens';
import SignUpPage from '../Pages/SignUpPage';
import ReceiveTokens from '../Pages/ReceiveTokens';
import TransactionHistory from '../Pages/TransactionHistory';
//import Navbar from '../Components/Navbar/Navbar';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <div className="p-4">
                <Routes>
                    <Route path="/" element={<SignInPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path= "/sendTokens" element={<SendTokens />} />
                    <Route path= "/signUp" element={<SignUpPage />} />
                    <Route path= "/receiveTokens" element={<ReceiveTokens />} />
                    <Route path= "/transactionHistory" element={<TransactionHistory />} />
                </Routes>
            </div>
        </Router>
    );
};

export default AppRouter;