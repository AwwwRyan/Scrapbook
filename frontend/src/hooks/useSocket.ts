import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection with correct configuration
    socketRef.current = io(SOCKET_URL, {
      path: '/socket.io/',  // Match your Django backend socket.io path
      withCredentials: true,  // Add this line to include credentials
      transports: ['websocket', 'polling'],  // Enable both transport methods
      auth: {
        token: token  // Send token for authentication
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnection: true,  // Enable reconnection
      reconnectionAttempts: 5,  // Number of reconnection attempts
      reconnectionDelay: 1000,  // Delay between reconnection attempts
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('🟢 Socket Connected:', socketRef.current?.id);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('🔴 Socket Connection Error:', error);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
    });

    socketRef.current.on('private_message', (message) => {
      console.log('📨 Received Message:', message);
    });

    socketRef.current.on('user_status', (status) => {
      console.log('👤 User Status Update:', status);
    });

    socketRef.current.on('typing_indicator', (data) => {
      console.log('✍️ Typing Indicator:', data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  return socketRef.current;
}; 