export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const setAuthToken = (accessToken: string): void => {
    console.log('🔄 Setting auth token:', {
        token: accessToken?.substring(0, 20) + '...',
        length: accessToken?.length,
        timestamp: new Date().toISOString()
    });

    try {
        localStorage.setItem('auth_token', accessToken);

        const savedToken = localStorage.getItem('auth_token');
        console.log('✅ Token saved to localStorage:', {
            saved: !!savedToken,
            length: savedToken?.length,
            match: savedToken === accessToken
        });
    } catch (error) {
        console.error('❌ Failed to save token to localStorage:', error);
    }
};

export const clearAuthToken = (): void => {
    localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};