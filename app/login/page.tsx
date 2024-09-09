"use client"
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
// import ResetPasswordModal from '../components/ResetPasswordModal';

const SignIn = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const openModal = () => setIsModalOpen(true);
    // const closeModal = () => setIsModalOpen(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/admin"
        } catch (error) {
            setError('Failed to sign in. Please check your credentials.');
        }

        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                    </form>
                    {/* <button
                        onClick={openModal}
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Forgot Password?
                    </button>
                    <ResetPasswordModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                    /> */}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignIn;
