'use client'
import { useState, useEffect } from 'react';
import { client } from '../../sanity/lib/client'; // Make sure you have sanityClient configured

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
    const [students, setStudents] = useState<StudentAdmission[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await client.fetch('*[_type == "studentAdmission"]');
            setStudents(data);
        };

        fetchStudents();
    }, []);

    const handleStatusChange = async (studentId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await client.patch(studentId).set({ status: newStatus }).commit();
            alert(`Student ${newStatus} successfully!`);
            setStudents(students.map(student => student._id === studentId ? { ...student, status: newStatus } : student));
        } catch (error) {
            console.error(`${newStatus} failed:`, error);
            alert(`${newStatus} failed. Please try again.`);
        }
    };

    return (
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
    );
};

export default Admin;
