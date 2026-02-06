'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import colleges from '@/app/CollegeList';

// PSG Colleges that require specific email domains
const PSG_COLLEGES = {
    'PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004': '@psgtech.ac.in',
    'PSG Institute of Technology and Applied Research, Avinashi Road, Neelambur, Coimbatore 641062': '@psgitech.ac.in'
};

export default function RegisterComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const source = searchParams.get('source');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        college: '',
        department: '',
        year: '',
        referral: '',
        accomodation: false,
        discoveryMethod: '',
        source: source || 'email',
        googleId: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEmailOverlay, setShowEmailOverlay] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showInstructionsOverlay, setShowInstructionsOverlay] = useState(false);
    const [instructionsAgreed, setInstructionsAgreed] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('registration_email');
        const storedGoogleId = localStorage.getItem('registration_googleId');
        const storedReferralCode = localStorage.getItem('club_referral_code');

        if (!storedEmail) {
            router.push('/auth?type=register');
            return;
        }

        setFormData(prev => ({
            ...prev,
            email: storedEmail || '',
            googleId: storedGoogleId || '',
            source: source || 'email',
            referral: storedReferralCode || prev.referral
        }));
    }, [source, router]);

    // Check if email is from a PSG college
    const isPSGEmail = () => {
        const emailLower = formData.email.toLowerCase();
        return Object.values(PSG_COLLEGES).some(domain => emailLower.endsWith(domain));
    };

    // Auto-select college based on email domain
    useEffect(() => {
        if (!formData.email) return;

        const emailLower = formData.email.toLowerCase();

        for (const [collegeName, emailDomain] of Object.entries(PSG_COLLEGES)) {
            if (emailLower.endsWith(emailDomain)) {
                setFormData(prev => ({
                    ...prev,
                    college: collegeName
                }));
                break;
            }
        }
    }, [formData.email]);

    // Check if the selected college is a PSG college and validate email domain
    const validatePSGEmail = () => {
        const selectedCollege = formData.college;
        const email = formData.email.toLowerCase();

        if (PSG_COLLEGES[selectedCollege]) {
            const requiredDomain = PSG_COLLEGES[selectedCollege];
            return email.endsWith(requiredDomain);
        }
        return true;
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (e.target.name === 'college') {
            setShowEmailOverlay(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validatePSGEmail()) {
            setShowEmailOverlay(true);
            return;
        }

        if (formData.source === 'email' && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setShowInstructionsOverlay(true);
    };

    const finalizeRegistration = async () => {
        setLoading(true);

        try {
            const storedReferralCode = localStorage.getItem('club_referral_code');

            const registrationData = {
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                college: formData.college,
                department: formData.department,
                year: parseInt(formData.year),
                referral: formData.referral || storedReferralCode || '',
                accomodation: formData.accomodation,
                discoveryMethod: formData.discoveryMethod,
                source: formData.source
            };

            if (formData.source === 'email') {
                registrationData.password = formData.password;
            } else if (formData.source === 'google') {
                registrationData.googleId = formData.googleId;
            }

            await authService.register(registrationData);

            localStorage.removeItem('registration_email');
            localStorage.removeItem('registration_googleId');
            localStorage.removeItem('club_referral_code');

            router.push('/portal/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold font-general text-[#dfdff2] mb-2">Complete Registration</h1>
                    <p className="text-gray-400">
                        {formData.source === 'google' ? 'Complete your Google registration' : 'Create your account'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Account Information Section */}
                    <div className="border-b border-white/20 pb-6">
                        <h3 className="text-lg font-semibold font-general text-[#dfdff2] mb-4">Account Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-md cursor-not-allowed"
                                />
                            </div>

                            {formData.source === 'email' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Min. 6 characters"
                                                required
                                                minLength={6}
                                                className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-2.5 text-gray-400 hover:text-[#dfdff2]"
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                                            Confirm Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Re-enter password"
                                                required
                                                minLength={6}
                                                className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-2.5 text-gray-400 hover:text-[#dfdff2]"
                                            >
                                                {showConfirmPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="border-b border-white/20 pb-6">
                        <h3 className="text-lg font-semibold font-general text-[#dfdff2] mb-4">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    required
                                    pattern="[0-9]{10}"
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="border-b border-white/20 pb-6">
                        <h3 className="text-lg font-semibold font-general text-[#dfdff2] mb-4">Academic Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="college" className="block text-sm font-medium text-gray-400 mb-1">
                                    College *
                                </label>
                                <select
                                    id="college"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    required
                                    disabled={isPSGEmail()}
                                    className={`w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66] ${isPSGEmail() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="" className="bg-black text-gray-400">Select your college</option>
                                    {colleges.map((college, index) => (
                                        <option key={index} value={college} className="bg-black text-[#dfdff2]">
                                            {college}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-400 mb-1">
                                        Department *
                                    </label>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        list="department-options"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="Select or type your department"
                                        required
                                        autoComplete="off"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                    />
                                    <datalist id="department-options">
                                        <option value="Automobile Engineering" />
                                        <option value="Biomedical Engineering" />
                                        <option value="Civil Engineering" />
                                        <option value="Computer Science and Engineering" />
                                        <option value="Computer Science and Engineering (AI and ML)" />
                                        <option value="Electrical and Electronics Engineering" />
                                        <option value="Electronics and Communication Engineering" />
                                        <option value="Instrumentation and Control Engineering" />
                                        <option value="Mechanical Engineering" />
                                        <option value="Metallurgical Engineering" />
                                        <option value="Production Engineering" />
                                        <option value="Robotics and Automation" />
                                        <option value="Bio Technology" />
                                        <option value="Fashion Technology" />
                                        <option value="Information Technology" />
                                        <option value="Textile Technology" />
                                        <option value="Artificial intelligence and Data Science" />
                                        <option value="Applied Mathematics and Computational Science" />
                                    </datalist>
                                </div>

                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-400 mb-1">
                                        Year *
                                    </label>
                                    <select
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                    >
                                        <option value="" className="bg-black text-gray-400">Select year</option>
                                        <option value="1" className="bg-black text-[#dfdff2]">1st Year</option>
                                        <option value="2" className="bg-black text-[#dfdff2]">2nd Year</option>
                                        <option value="3" className="bg-black text-[#dfdff2]">3rd Year</option>
                                        <option value="4" className="bg-black text-[#dfdff2]">4th Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="pb-2">
                        <h3 className="text-lg font-semibold font-general text-[#dfdff2] mb-4">Additional Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="referral" className="block text-sm font-medium text-gray-400 mb-1">
                                    Referral Code
                                </label>
                                <input
                                    type="text"
                                    id="referral"
                                    name="referral"
                                    value={formData.referral}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    readOnly={!!localStorage.getItem('club_referral_code')}
                                    className={`w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66] ${localStorage.getItem('club_referral_code') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            <div>
                                <label htmlFor="discoveryMethod" className="block text-sm font-medium text-gray-400 mb-1">
                                    How did you hear about us?
                                </label>
                                <select
                                    id="discoveryMethod"
                                    name="discoveryMethod"
                                    value={formData.discoveryMethod}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                >
                                    <option value="" className="bg-black text-gray-400">Select an option</option>
                                    <option value="social_media" className="bg-black text-[#dfdff2]">Social Media</option>
                                    <option value="friends" className="bg-black text-[#dfdff2]">Friends/Word of mouth</option>
                                    <option value="eventopia" className="bg-black text-[#dfdff2]">Eventopia</option>
                                    <option value="posters" className="bg-black text-[#dfdff2]">Posters/Flyers</option>
                                    <option value="college_announcement" className="bg-black text-[#dfdff2]">College Announcement</option>
                                    <option value="other" className="bg-black text-[#dfdff2]">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#edff66] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Complete Registration'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    <span className="text-gray-400">Already have an account?{' '}</span>
                    <button
                        onClick={() => router.push('/auth?type=login')}
                        className="text-[#edff66] hover:text-white font-medium"
                    >
                        Login
                    </button>
                </p>
            </div>

            {/* PSG College Email Validation Overlay */}
            {showEmailOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-black/90 backdrop-blur-md border border-white/10 shadow-xl rounded-lg max-w-md w-full p-8">
                        <div className="flex justify-center mb-4">
                            <svg className="h-16 w-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold font-general text-center text-[#dfdff2] mb-4">College Email Required</h2>
                        <p className="text-gray-400 text-center mb-2">
                            To register as a student of <strong className="text-[#dfdff2]">{formData.college}</strong>,
                            please use your official college email address ending with
                        </p>
                        <p className="text-[#edff66] font-mono text-center font-semibold mb-6">
                            {PSG_COLLEGES[formData.college]}
                        </p>
                        <button
                            className="w-full bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4 mb-3"
                            onClick={() => {
                                localStorage.removeItem('registration_email');
                                localStorage.removeItem('registration_googleId');
                                router.push('/auth?type=register');
                            }}
                        >
                            Register with College Email
                        </button>
                        <button
                            className="w-full text-[#edff66] hover:text-white font-medium"
                            onClick={() => setShowEmailOverlay(false)}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {/* Instructions Overlay */}
            {showInstructionsOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-black/90 backdrop-blur-md border border-white/10 shadow-xl rounded-lg max-w-lg w-full p-8">
                        <div className="flex justify-center mb-4">
                            <svg className="h-16 w-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" />
                                <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold font-general text-center text-[#dfdff2] mb-4">Important Instructions</h2>
                        <div className="text-left mb-6">
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li>Bring a <strong className="text-[#dfdff2]">Bonafide Certificate</strong> from your respective college.</li>
                                <li>Upload your <strong className="text-[#dfdff2]">College ID card</strong> on the portal and carry the same ID during the event.</li>
                                <li>A participant can attend only <strong className="text-[#dfdff2]">one workshop</strong> – Fee: ₹350.</li>
                                <li>By paying <strong className="text-[#dfdff2]">₹150</strong>, a participant can attend any number of events / paper presentations.</li>
                                <li><strong className="text-[#dfdff2]">Accommodation</strong> will be provided on an FCFS basis for the first 100 students only.</li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-center mb-6">
                            <input
                                type="checkbox"
                                id="agreeInstructions"
                                checked={instructionsAgreed}
                                onChange={(e) => setInstructionsAgreed(e.target.checked)}
                                className="h-4 w-4 text-[#edff66] border-white/20 rounded focus:ring-[#edff66]"
                            />
                            <label htmlFor="agreeInstructions" className="ml-2 text-sm text-gray-400">
                                I have read and understood the instructions
                            </label>
                        </div>

                        <button
                            className="w-full bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                                if (instructionsAgreed) {
                                    finalizeRegistration();
                                } else {
                                    alert('Please agree to the instructions to proceed.');
                                }
                            }}
                            disabled={!instructionsAgreed || loading}
                        >
                            {loading ? 'Processing...' : 'Confirm & Register'}
                        </button>
                        <button
                            className="w-full text-[#edff66] hover:text-white font-medium"
                            onClick={() => setShowInstructionsOverlay(false)}
                            disabled={loading}
                        >
                            Review Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
