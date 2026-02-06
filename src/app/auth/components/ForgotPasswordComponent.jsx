'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function ForgotPasswordComponent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            localStorage.setItem('reset_password_email', email);
            await authService.forgotPassword({ email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-general text-[#dfdff2] mb-2">Check Your Email</h2>
                    <p className="text-gray-400 mb-4">
                        We've sent a reset link to <strong className="text-[#dfdff2]">{email}</strong>
                    </p>
                    <button
                        onClick={() => router.push('/auth?type=login')}
                        className="bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8">
                <h2 className="text-2xl font-bold font-general text-center text-[#dfdff2] mb-6">Forgot Password</h2>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#edff66] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    <span className="text-gray-400">Remember your password?{' '}</span>
                    <button
                        onClick={() => router.push('/auth?type=login')}
                        className="text-[#edff66] hover:text-white font-medium"
                    >
                        Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
}
