import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { User } from '../types';

type AuthResponse = {
    success: boolean;
    message?: string;
};

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (name: string, email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
};

const useAuth = () => {
    const context = useContext(AuthContext) as AuthContextValue | null;
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;
