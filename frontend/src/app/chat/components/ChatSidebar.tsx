'use client';

import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chat';
import { formatDistanceToNow } from 'date-fns';

export default function ChatSidebar() {
  const { contacts, unreadCounts, activeChat, setActiveChat, onlineUsers } = useChatStore();

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <Input 
          placeholder="Search contacts..." 
          className="w-full"
        />
      </div>
      
      <ScrollArea className="flex-1">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 hover:bg-accent cursor-pointer ${
              activeChat?.id === contact.id ? 'bg-accent' : ''
            }`}
            onClick={() => setActiveChat(contact)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{contact.username[0]}</AvatarFallback>
                </Avatar>
                {onlineUsers.has(contact.id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{contact.username}</span>
                  {unreadCounts[contact.id] > 0 && (
                    <Badge variant="secondary">
                      {unreadCounts[contact.id]}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {contact.lastMessage?.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
} 