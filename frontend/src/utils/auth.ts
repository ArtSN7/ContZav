export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const setAuthToken = (accessToken: string): void => {
    localStorage.setItem('auth_token', accessToken);
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