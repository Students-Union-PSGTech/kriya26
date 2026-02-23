'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasCheckedAuth = useRef(false);

    const checkAuth = useCallback(async ({ preserveUserOnError = false } = {}) => {
        try {
            const response = await authService.getProfile();
            const profileUser = response?.user || response || null;
            setUser(profileUser);
            return profileUser;
        } catch (error) {
            if (!preserveUserOnError) {
                setUser(null);
            }
            return null;
        } finally {
            setLoading(false);
            hasCheckedAuth.current = true;
        }
    }, []);

    useEffect(() => {
        if (!hasCheckedAuth.current) {
            checkAuth();
        }
    }, [checkAuth]);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const loginUser = response?.user || null;
        if (loginUser) {
            setUser(loginUser);
        }
        setLoading(true);
        await checkAuth({ preserveUserOnError: true });
        return response;
    };

    const googleLogin = async (data) => {
        const response = await authService.loginGoogle(data);
        const loginUser = response?.user || null;
        if (loginUser) {
            setUser(loginUser);
        }
        setLoading(true);
        await checkAuth({ preserveUserOnError: true });
        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('kriya_avatar');
                localStorage.removeItem('kriya_auth_callback');
            }
            setUser(null);
            hasCheckedAuth.current = false;
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    const value = {
        user,
        loading,
        isAuthenticated: user,
        login,
        googleLogin,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
