export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const clearAuthTokens = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};