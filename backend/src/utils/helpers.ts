export const generateRandomId = (length: number = 16): string => {
    return Math.random().toString(36).substring(2, length + 2);
};

export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
