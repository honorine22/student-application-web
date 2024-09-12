'use client'
import { useState, useEffect } from 'react';
import { client } from '../../sanity/lib/client'; // Make sure you have sanityClient configured
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { sendMail } from '../utils/lib/sendAdmissionEmail';

interface StudentAdmission {
    _id: string;
    firstName: string;
    lastName: string;
    telephoneNumber: string;
    nationalIDNumber: string;
    country: string;
    district: string;
    sector: string;
    email: string;
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


    const handleDeleteStudent = async (studentId: string, studentName: string, studentEmail: string) => {
        const confirmation = window.confirm(`Are you sure you want to delete the student ${studentName} (${studentEmail})?`);
        if (!confirmation) return;

        try {
            // Deleting the student document by ID
            await client.delete(studentId);
            setStudents(students.filter(student => student._id !== studentId));
            // Optionally, you can add a notification or reload the page after deletion
            toast.success(`Student ${studentName} has been successfully deleted.`);
            // location.reload(); // Uncomment if you want to reload the page
        } catch (error) {
            console.error("Failed to delete the student:", error);
            toast.error("An error occurred while deleting the student. Please try again.");
        }
    };


    const handleStatusChange = async (studentId: string, newStatus: 'approved' | 'rejected', studentName: string, studentEmail: string) => {
        const confirmation = window.confirm(`Are you sure you want to change the status to ${newStatus}?`);
        if (!confirmation) return;

        try {
            await client.patch(studentId).set({ status: newStatus }).commit();
            // Determine the subject and body based on the student's status
            let subject = '';
            let body = '';

            if (newStatus === 'approved') {
                subject = `Congratulations🥳! You’ve Been Admitted to ETP`;
                body = `Dear ${studentName},

            Congratulations! We are pleased to inform you that you have been admitted to ETP College for the 2024/2025.

            Your hard work and dedication have truly paid off, and we are excited to welcome you to our academic community. 
            As an admitted student, you will soon receive more information about the next steps, 
            including how to confirm your enrollment, register for classes, and get involved in campus activities.

            If you have any questions or need further assistance, please do not hesitate to contact our admissions office at [Admissions Office Email] or [Phone Number]. 
            We are here to help you every step of the way.

            Once again, congratulations on your admission, and we look forward to seeing you on campus!

            Warm regards,
            Joseph Karuranga
            Manager Director, ETP
            +250788504249`;
            } else {
                subject = `Admission Decision for ETP`;
                body = `Dear ${studentName},

            Thank you for your interest in ETP College. 
            After careful consideration of your application, we regret to inform you that we are unable to offer you admission to our program for the 2024/2025.

            We understand that this news may be disappointing, and we want to emphasize that this decision does not reflect your abilities or potential. 
            The admissions process is highly competitive, and we had to make some very difficult decisions this year.

            We encourage you to continue pursuing your academic and career goals, and we wish you the very best in your future endeavors. 
            If you have any questions or would like feedback on your application, please feel free to contact our admissions office at [Admissions Office Email].

            Thank you again for considering ETP College. We wish you success in all your future pursuits.

            Sincerely,
            Joseph Karuranga
            Manager Director, ETP
            +250788504249`;
            }

            // Combine email text
            const mailText = `${body}`;

            // Send email
            const response = await sendMail({
                sendTo: studentEmail,
                subject: subject,
                text: mailText,
            });

            if (response?.messageId) {
                toast.success(`Student ${newStatus} and email sent successfully!`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setStudents(students.map(student => student._id === studentId ? { ...student, status: newStatus } : student));
            } else {
                toast.error('Failed to send email.');
            }

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

                                        <div className="flex space-x-2">
                                            {student.status === 'pending' && (
                                                <><button
                                                    onClick={() => {
                                                        handleStatusChange(student._id, 'approved', student.firstName, student.email);

                                                    }}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                >
                                                    Approve
                                                </button><button
                                                    onClick={() => {
                                                        handleStatusChange(student._id, 'rejected', student.firstName, student.email);

                                                    }}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                >
                                                        Reject
                                                    </button></>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleDeleteStudent(student._id, student.firstName, student.email)

                                                }}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
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
