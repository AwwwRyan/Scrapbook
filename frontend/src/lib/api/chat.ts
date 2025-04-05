import axiosInstance from './axiosConfig';
import { Contact, Message } from '@/types/chat';

interface UnreadCountsResponse {
  [userId: string]: number;
}

export const chatApi = {
  getContacts: async () => {
    try {
      const response = await axiosInstance.get('/chat/contacts/');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  getChatMessages: async (contactId: string) => {
    try {
      const response = await axiosInstance.get(`/chat/messages/${contactId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  searchUsers: async (query: string) => {
    try {
      const response = await axiosInstance.get('/chat/search/', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  addContact: async (userId: string) => {
    try {
      const response = await axiosInstance.post(`/chat/contacts/add/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  removeContact: async (userId: string) => {
    try {
      const response = await axiosInstance.delete(`/chat/contacts/remove/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  },

  markMessagesRead: async (userId: string) => {
    try {
      const response = await axiosInstance.put(`/chat/messages/read/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  getUnreadCounts: async (): Promise<UnreadCountsResponse> => {
    try {
      const response = await axiosInstance.get<UnreadCountsResponse>('/chat/unread/');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread counts:', error);
      throw error;
    }
  }
}; 