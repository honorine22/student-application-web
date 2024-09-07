// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} ETP Admissions. All rights reserved.</p>
                <p>Privacy Policy | Terms of Service</p>
            </div>
        </footer>
    );
};

export default Footer;
