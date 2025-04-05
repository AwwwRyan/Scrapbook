import { create } from 'zustand';
import { Message, Contact, ChatState } from '@/types/chat';

interface ChatStore {
  contacts: Contact[];
  activeChat: Contact | null;
  messages: { [contactId: string]: Message[] };
  unreadCounts: { [contactId: string]: number };
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
  setContacts: (contacts: Contact[]) => void;
  setActiveChat: (contact: Contact | null) => void;
  addMessage: (contactId: string, message: Message) => void;
  setMessages: (contactId: string, messages: Message[]) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  setUnreadCount: (contactId: string, count: number) => void;
  setOnlineStatus: (userId: string, isOnline: boolean) => void;
  setTypingStatus: (userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  contacts: [],
  activeChat: null,
  messages: {},
  unreadCounts: {},
  onlineUsers: new Set(),
  typingUsers: new Set(),

  setContacts: (contacts) => set({ contacts }),
  
  setActiveChat: (contact) => set({ activeChat: contact }),
  
  addMessage: (contactId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [contactId]: [...(state.messages[contactId] || []), message],
    },
  })),
  
  setMessages: (contactId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [contactId]: messages,
    },
  })),
  
  updateMessageStatus: (messageId, status: 'sent' | 'delivered' | 'read') => set((state) => {
    const newMessages = { ...state.messages };
    Object.keys(newMessages).forEach((contactId) => {
      newMessages[contactId] = newMessages[contactId].map((msg) =>
        msg.id === messageId ? { ...msg, status: status as Message['status'] } : msg
      );
    });
    return { messages: newMessages };
  }),
  
  setUnreadCount: (contactId, count) => set((state) => ({
    unreadCounts: {
      ...state.unreadCounts,
      [contactId]: count,
    },
  })),
  
  setOnlineStatus: (userId, isOnline) => set((state) => ({
    onlineUsers: isOnline
      ? new Set(state.onlineUsers).add(userId)
      : new Set([...state.onlineUsers].filter((id) => id !== userId)),
  })),
  
  setTypingStatus: (userId, isTyping) => set((state) => ({
    typingUsers: isTyping
      ? new Set(state.typingUsers).add(userId)
      : new Set([...state.typingUsers].filter((id) => id !== userId)),
  })),
})); 