'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

export default function ResetPasswordComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('reset_password_email');
        if (storedEmail) {
            setEmail(storedEmail);
        }

        if (!token) {
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword({ token, newPassword: password });
            localStorage.removeItem('reset_password_email');
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
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
                    <h2 className="text-2xl font-bold font-general text-[#dfdff2] mb-2">Password Reset</h2>
                    <p className="text-gray-400 mb-4">Your password has been successfully reset.</p>
                    <button
                        onClick={() => router.push('/auth?type=login')}
                        className="bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8">
                <h2 className="text-2xl font-bold font-general text-center text-[#dfdff2] mb-6">Reset Password</h2>

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
                            readOnly
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 text-gray-400 rounded-md cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
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
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 text-[#dfdff2] placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edff66]"
                                placeholder="Re-enter password"
                                required
                                minLength={6}
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

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#edff66] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
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
