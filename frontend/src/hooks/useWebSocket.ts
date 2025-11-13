import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:5090', {
            auth: {
                token: localStorage.getItem('auth_token')
            }
        });

        newSocket.on('connect', () => {
            console.log('Socket.IO connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return { socket, isConnected };
};