// Navbar.tsx
import Link from 'next/link';
import React from 'react';

const Navbar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-xl font-bold">ETP Admissions</Link>
                <div className="flex space-x-4">
                    {isAdmin ? (
                        <>
                            <Link href="/admin" className="text-white hover:text-gray-200">Manage Students</Link>
                           
                        </>
                    ) : (
                        <>
                            <Link href="/" className="text-white hover:text-gray-200">Program Info</Link>
                            <Link href="/register" className="text-white hover:text-gray-200">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
