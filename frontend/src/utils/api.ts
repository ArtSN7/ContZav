import { getAuthToken, setAuthToken, clearAuthToken } from './auth.ts';

export const API_BASE_URL = 'http://localhost:5090/api';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void, reject: (reason?: any) => void }> = [];

let externalRefreshAuthToken: (() => Promise<boolean>) | null = null;
let externalLogout: (() => void) | null = null;

export const setAuthContextFunctions = (refreshFn: () => Promise<boolean>, logoutFn: () => void) => {
    externalRefreshAuthToken = refreshFn;
    externalLogout = logoutFn;
    console.log('✅ AuthContext functions integrated with api.ts');
};

const redirectToAuth = () => {
    console.log('🔀 Redirecting to auth page...');
    clearAuthToken();
    if (externalLogout) {
        externalLogout();
    } else {
        window.location.href = '/auth';
    }
};

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
    console.log('🔄 Attempting token refresh...');

    if (externalRefreshAuthToken) {
        console.log('🔄 Using external refresh function from AuthContext');
        const success = await externalRefreshAuthToken();
        if (success) {
            const newToken = getAuthToken();
            if (newToken) {
                console.log('✅ New access token set via AuthContext refresh');
                return newToken;
            }
        }
        console.error('❌ Token refresh failed via AuthContext');
        throw new Error('Token refresh failed');
    }

    console.log('🔄 Using direct refresh implementation');
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log('📡 Refresh response:', {
        path: '/auth/refresh',
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
    });

    if (!response.ok) {
        let errorText = 'No error body';
        try {
            errorText = await response.text();
        } catch (e) {
            errorText = 'Cannot read error response';
        }
        console.error('❌ Token refresh failed:', {
            path: '/auth/refresh',
            status: response.status,
            error: errorText
        });
        if (response.status === 401) {
            redirectToAuth();
        }
        throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
    }

    let data;
    try {
        data = await response.json();
        console.log('✅ Refresh response data:', {
            path: '/auth/refresh',
            fullResponse: data
        });
    } catch (e) {
        console.error('❌ Failed to parse refresh response:', e);
        throw new Error('Invalid JSON in refresh response');
    }

    if (!data.success || !data.data?.accessToken) {
        console.error('❌ Invalid refresh response format:', {
            path: '/auth/refresh',
            data: data
        });
        throw new Error('Invalid refresh response format');
    }

    setAuthToken(data.data.accessToken);
    console.log('✅ New access token set for path:', '/auth/refresh');
    return data.data.accessToken;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const path = url.replace(API_BASE_URL, '');
    console.log('📤 Making request:', {
        path,
        method: options.method || 'GET',
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });

    let response;
    try {
        response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
        });
    } catch (networkError) {
        console.error('❌ Network error:', {
            path,
            error: networkError
        });
        throw new Error(`Network error: ${networkError}`);
    }

    console.log('📥 Response received:', {
        path,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
    });

    if (response.status === 401 && token && !url.includes('/auth/refresh')) {
        console.log('🔐 Token expired, attempting refresh for path:', path);

        if (isRefreshing) {
            console.log('⏳ Refresh in progress, queuing request for path:', path);
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => fetchWithAuth(url, options));
        }

        isRefreshing = true;
        console.log('🔄 Starting token refresh process for path:', path);

        try {
            const newToken = await refreshToken();
            processQueue(null, newToken);

            const retryHeaders = {
                ...headers,
                'Authorization': `Bearer ${newToken}`,
            };

            console.log('🔄 Retrying original request with new token for path:', path);
            response = await fetch(url, {
                ...options,
                headers: retryHeaders,
                credentials: 'include',
            });

            console.log('📥 Retry response:', {
                path,
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

        } catch (error: any) {
            console.error('❌ Refresh failed for path:', path, {
                error: error.message
            });
            processQueue(error, null);
            clearAuthToken();
            redirectToAuth();
            throw error;
        } finally {
            isRefreshing = false;
        }
    }

    let responseData;
    try {
        responseData = await response.json();
        console.log('📄 Full response data for path:', path, {
            fullResponse: responseData
        });
    } catch (parseError) {
        console.error('❌ Failed to parse response JSON for path:', path, {
            error: parseError
        });
        throw new Error(`Invalid JSON response: ${parseError}`);
    }

    if (!response.ok) {
        console.error('❌ HTTP error for path:', path, {
            status: response.status,
            statusText: response.statusText,
            responseData: responseData
        });

        if (response.status === 401) {
            redirectToAuth();
        }

        throw new Error(`HTTP error! status: ${response.status}, message: ${responseData?.error || response.statusText}`);
    }

    console.log('✅ Request successful for path:', path, {
        success: responseData.success
    });

    return responseData;
};

export const api = {
    get: (endpoint: string) => {
        console.log('🔵 API GET:', endpoint);
        return fetchWithAuth(`${API_BASE_URL}${endpoint}`);
    },

    post: (endpoint: string, data: any = {}) => {
        console.log('🟢 API POST:', endpoint, data);
        return fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    put: (endpoint: string, data: any = {}) => {
        console.log('🟡 API PUT:', endpoint, data);
        return fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: (endpoint: string) => {
        console.log('🔴 API DELETE:', endpoint);
        return fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
    },
};