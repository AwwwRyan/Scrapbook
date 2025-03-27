'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        // Connect to Socket.IO server
        const newSocket = io('http://localhost:8000', {
            transports: ['websocket'],
            path: '/socket.io/'
        });

        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        newSocket.on('message', (data: string) => {
            setMessages((prev) => [...prev, data]);
        });

        newSocket.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit('message', message);
            setMessage('');
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 h-96 overflow-y-auto border rounded p-4">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        {msg}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Type a message..."
                />
                <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
