import useSWR from 'swr';

interface User {
    id: string;
    // other user properties...
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    // other auth properties...
}

export const useAuth = (): AuthContextType => {
    const { data, isValidating, ...otherResults } = useSWR('auth', () => {
        // fake auth user
        return localStorage.getItem('token');
    });

    return {
        isLoggedIn: Boolean(data) && !isValidating,
        user: data ? { id: data } : null,
        ...otherResults,
    };
};
