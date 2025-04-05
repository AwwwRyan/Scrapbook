'use client';

import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useChatStore } from '@/store/chat';
import ChatSidebar from './components/ChatSidebar';
import ChatMain from './components/ChatMain';
import ChatDebug from './components/ChatDebug';

export default function ChatPage() {
  const socket = useSocket();
  const { setOnlineStatus, addMessage, updateMessageStatus } = useChatStore();

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on('private_message', (message) => {
      addMessage(message.from_user, message);
    });

    // Listen for user status changes
    socket.on('user_status', ({ user_id, status }) => {
      setOnlineStatus(user_id, status === 'online');
    });

    // Listen for message status updates
    socket.on('message_status', ({ message_id, status }) => {
      updateMessageStatus(message_id, status);
    });

    return () => {
      socket.off('private_message');
      socket.off('user_status');
      socket.off('message_status');
    };
  }, [socket]);

  return (
    <div className="flex h-screen bg-background">
      {process.env.NODE_ENV === 'development' && <ChatDebug />}
      <ChatSidebar />
      <ChatMain />
    </div>
  );
} 