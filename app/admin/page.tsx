'use client'
import { useState, useEffect } from 'react';
import { client } from '../../sanity/lib/client'; // Make sure you have sanityClient configured
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface StudentAdmission {
    _id: string;
    firstName: string;
    lastName: string;
    telephoneNumber: string;
    nationalIDNumber: string;
    country: string;
    district: string;
    sector: string;
    village: string;
    tradeToLearn: string;
    status: 'pending' | 'approved' | 'rejected';
}

const Admin: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentAdmission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email || null);
            } else {
                setUserEmail(null);
            }
            setLoading(false);
        });


        const fetchStudents = async () => {
            const data = await client.fetch('*[_type == "studentAdmission"]');
            setStudents(data);
        };

        fetchStudents();
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userEmail) {
        return <div>Not signed in</div>;
    }

    // List of authorized emails
    //  const AUTHORIZED_EMAILS = ["authorized_user@example.com"];

    //  if (!AUTHORIZED_EMAILS.includes(userEmail)) {
    //    return <div>Unauthorized</div>;
    //  }

    const handleStatusChange = async (studentId: string, newStatus: 'approved' | 'rejected') => {
        const confirmation = window.confirm(`Are you sure you want to change the status to ${newStatus}?`);
        if (!confirmation) return;

        try {
            await client.patch(studentId).set({ status: newStatus }).commit();

            toast.success(`Student ${newStatus} successfully!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setStudents(students.map(student => student._id === studentId ? { ...student, status: newStatus } : student));
        } catch (error) {
            console.error(`${newStatus} failed:`, error);
            toast.error(`Failed to ${newStatus} the student. Please try again.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-3 px-6 bg-blue-600 text-white text-left">Name</th>
                                <th className="py-3 px-6 bg-blue-600 text-white text-left">Trade</th>
                                <th className="py-3 px-6 bg-blue-600 text-white text-left">Country</th>
                                <th className="py-3 px-6 bg-blue-600 text-white text-left">Status</th>
                                <th className="py-3 px-6 bg-blue-600 text-white text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-4 px-6 text-gray-700">
                                        {student.firstName} {student.lastName}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">{student.tradeToLearn}</td>
                                    <td className="py-4 px-6 text-gray-700">{student.country}</td>
                                    <td className="py-4 px-6 text-gray-700">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${student.status === 'approved'
                                                ? 'bg-green-100 text-green-700'
                                                : student.status === 'rejected'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">
                                        {student.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleStatusChange(student._id, 'approved')}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student._id, 'rejected')}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Admin;
