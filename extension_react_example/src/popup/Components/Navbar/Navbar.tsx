import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link to="/">MyApp</Link>
                </div>
                <ul className="flex space-x-4">

                    <li>
                        <Link className="text-white hover:underline" to="/wallet">Wallet</Link>
                    </li>
                    <li>
                        <Link className="text-white hover:underline" to="/settings">Settings</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
