'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/store/chat';
import { useSocket } from '@/hooks/useSocket';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble'
import { format } from 'date-fns';

export default function ChatMain() {
  const socket = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeChat, messages, typingUsers, onlineUsers } = useChatStore();
  const currentChatMessages = activeChat ? messages[activeChat.id] || [] : [];

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChatMessages]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src={activeChat.avatar} />
          <AvatarFallback>{activeChat.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{activeChat.username}</h2>
          <p className="text-sm text-muted-foreground">
            {onlineUsers.has(activeChat.id) 
              ? 'Online'
              : activeChat.lastSeen 
                ? `Last seen ${format(new Date(activeChat.lastSeen), 'PP')}`
                : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {currentChatMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.fromUser === 'me'}
            />
          ))}
        </div>
        
        {typingUsers.has(activeChat.id) && (
          <div className="text-sm text-muted-foreground italic p-2">
            {activeChat.username} is typing...
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
} 