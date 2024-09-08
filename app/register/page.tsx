"use client";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { client } from '../../sanity/lib/client'; // Make sure you have sanityClient configured
import { toast } from 'react-toastify';

// Define the form inputs
interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    telephoneNumber: string;
    nationalIDNumber: string;
    country: string;
    district: string;
    sector: string;
    village: string;
    tradeToLearn: string;
    education: string
}

// Validation schema
const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    telephoneNumber: Yup.string().required('Telephone number is required'),
    nationalIDNumber: Yup.string().required('National ID Number is required'),
    country: Yup.string().required('Country is required'),
    district: Yup.string().required('District is required'),
    sector: Yup.string().required('Sector is required'),
    village: Yup.string().required('Village is required'),
    tradeToLearn: Yup.string().required('Trade to learn is required'),
    education: Yup.string().required('Education Level is required'),
});

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormInputs>({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data: RegisterFormInputs) => {
        try {
            await client.create({
                _type: 'studentAdmission',
                ...data,
                status: 'pending',
            });
            toast.success(`Registration successful!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            reset(); // Reset form after successful submission
            window.location.href = '/'; // Redirect to home page
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Registration</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className='flex flex-col md:flex-row lg:flex-row justify-between'>
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                {...register('firstName')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                {...register('lastName')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row lg:flex-row justify-between'>
                        <div>
                            <label className="block text-gray-700">Telephone Number</label>
                            <input
                                type="text"
                                {...register('telephoneNumber')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.telephoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.telephoneNumber && <p className="text-red-500 text-sm mt-1">{errors.telephoneNumber.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">National ID Number</label>
                            <input
                                type="text"
                                {...register('nationalIDNumber')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.nationalIDNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.nationalIDNumber && <p className="text-red-500 text-sm mt-1">{errors.nationalIDNumber.message}</p>}
                        </div>
                    </div>
                    <div className='flex justify-between flex-col md:flex-row lg:flex-row'>
                        <div>
                            <label className="block text-gray-700">Country</label>
                            <input
                                type="text"
                                {...register('country')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">District</label>
                            <input
                                type="text"
                                {...register('district')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.district ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row lg:flex-row justify-between'>
                        <div>
                            <label className="block text-gray-700">Sector</label>
                            <input
                                type="text"
                                {...register('sector')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.sector ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">Village</label>
                            <input
                                type="text"
                                {...register('village')}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.village ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">Level of Education</label>
                        <select
                            {...register('education')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.education ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        >

                            <option value="">Select your education level</option>
                            <option value="primary">Primary</option>
                            <option value="ordinary">Ordinary Level</option>
                            <option value="advanced">Advanced Level </option>
                            <option value="associate">Associate Degree</option>
                            <option value="bachelor">Bachelor`s Degree</option>
                            <option value="master">Master`s Degree</option>
                            <option value="doctorate">Doctorate</option>
                            {/* <!-- Add more options as needed --> */}
                        </select>
                        {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Trade to Learn</label>
                        <select
                            {...register('tradeToLearn')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.tradeToLearn ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        >
                            <option value="">Select a trade</option>
                            <option value="Tailoring">Tailoring/Ubudozi</option>
                            <option value="Electronic Services">Electronic Services</option>
                            <option value="Masonry">Masonry/Ubwubatsi</option>
                            <option value="Automobile Repair and Maintenance">Automobile Repair and Maintenance/Ubukanishi</option>
                            <option value="Church Music">Church Music/Umuziki ukoreshwa mu nsengero/Kiliziya</option>
                            <option value="Provisional permit">Provisional permit/Kwiga amategeko y`umuhanda</option>
                            <option value="Licence Cat B">Licence Cat B/Gutwara imodoka</option>
                            <option value="Licence Cat A">Licence Cat A</option>
                        </select>
                        {errors.tradeToLearn && <p className="text-red-500 text-sm mt-1">{errors.tradeToLearn.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
