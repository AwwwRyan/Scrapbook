'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useChatStore } from '@/store/chat';
import { Message } from '@/types/chat';

export default function MessageInput() {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { activeChat, addMessage } = useChatStore();

  const handleTyping = () => {
    if (!socket || !activeChat) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing event
    socket.emit('typing_indicator', { to_user: activeChat.id });

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { to_user: activeChat.id });
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!socket || !activeChat || !message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      timestamp: new Date().toISOString(),
      fromUser: 'me',
      toUser: activeChat.id,
      status: 'sent' as const
    };

    // Emit message to server
    socket.emit('private_message', {
      to_user: activeChat.id,
      message: message.trim()
    });

    // Add message to local state
    addMessage(activeChat.id, newMessage);
    setMessage('');
  };

  return (
    <div className="p-4 border-t flex items-center gap-2">
      <Input
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim()}
        size="icon"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
} 