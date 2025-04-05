export interface Contact {
  id: string;
  username: string;
  avatar?: string;
  lastMessage?: Message;
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  fromUser: string;
  toUser: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatState {
  contacts: Contact[];
  activeChat: Contact | null;
  messages: { [contactId: string]: Message[] };
  unreadCounts: { [contactId: string]: number };
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
} 