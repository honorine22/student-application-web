import React, { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function ResetPasswordModal({ isOpen, onRequestClose }: { isOpen: boolean, onRequestClose: () => void }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err) {
            setError('Failed to send reset email. Please try again.');
        }

        setLoading(false);
    };

    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Password Reset"
            className="modal"
            overlayClassName="overlay"
        >
            <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full p-16'>
                <h2 className="text-lg font-medium mb-4">Reset Password</h2>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="reset-email">Email</label>
                        <input
                            id="reset-email"
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Password Reset Email'}
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default ResetPasswordModal;
