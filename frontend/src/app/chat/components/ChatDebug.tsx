'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import { useChatStore } from '@/store/chat';

export default function ChatDebug() {
  const socket = useSocket();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { contacts, messages, onlineUsers, typingUsers } = useChatStore();

  const checkConnection = () => {
    if (socket?.connected) {
      setDebugInfo('Socket Connected ✅');
    } else {
      setDebugInfo('Socket Disconnected ❌');
    }
  };

  const logState = () => {
    const state = {
      contacts: contacts.length,
      messageThreads: Object.keys(messages).length,
      onlineUsers: Array.from(onlineUsers),
      typingUsers: Array.from(typingUsers),
    };
    setDebugInfo(JSON.stringify(state, null, 2));
  };

  const testMessage = () => {
    if (socket && contacts[0]) {
      socket.emit('private_message', {
        to_user: contacts[0].id,
        message: 'Test message ' + new Date().toISOString()
      });
      setDebugInfo('Test message sent');
    } else {
      setDebugInfo('No contacts available or socket not connected');
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg z-50">
      <div className="space-y-2">
        <Button onClick={checkConnection} variant="outline" size="sm">
          Check Connection
        </Button>
        <Button onClick={logState} variant="outline" size="sm">
          Log State
        </Button>
        <Button onClick={testMessage} variant="outline" size="sm">
          Send Test Message
        </Button>
      </div>
      {debugInfo && (
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
          {debugInfo}
        </pre>
      )}
    </div>
  );
} 