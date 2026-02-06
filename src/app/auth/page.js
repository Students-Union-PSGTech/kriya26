'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthContainer from './components/AuthContainer.jsx';
import SendEmailComponent from './components/SendEmailComponent.jsx';
import RegisterComponent from './components/RegisterComponent.jsx';
import CallbackComponent from './components/CallbackComponent.jsx';
import VerifyEmailComponent from './components/VerifyEmailComponent.jsx';
import ForgotPasswordComponent from './components/ForgotPasswordComponent.jsx';
import ResetPasswordComponent from './components/ResetPasswordComponent.jsx';

function AuthContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'login';

    const renderComponent = () => {
        switch (type) {
            case 'login':
            case 'register':
            case 'send-email':
                return <AuthContainer />;
            case 'complete-registration':
                return <RegisterComponent />;
            case 'callback':
                return <CallbackComponent />;
            case 'verify-email':
                return <VerifyEmailComponent />;
            case 'forgot-password':
                return <ForgotPasswordComponent />;
            case 'reset-password':
                return <ResetPasswordComponent />;
            default:
                return <AuthContainer />;
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="page-bg-overlay"></div>
            {renderComponent()}
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
