import { LoginCredentials, RegisterCredentials, User } from '@/types/user';
import axiosInstance from './axiosConfig';
import { useAuthStore } from '@/store/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables');
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axiosInstance.post('/users/login/', credentials);
      const { access } = response.data;
      
      if (access) {
        localStorage.setItem('token', access);
        useAuthStore.getState().setToken(access);
      } else {
        throw new Error('No access token received');
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await axiosInstance.post('/users/create/', credentials);
      const { access } = response.data;
      if (access) {
        localStorage.setItem('token', access);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await axiosInstance.put('/users/edit_user/', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token when fetching profile:', token); // Debug log

      const response = await axiosInstance.get('/users/profile/', {
        headers: {
          Authorization: `Bearer ${token}` // Explicitly set for debugging
        }
      });
      console.log('Profile response:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user profile:', {
        error,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.status === 401) {
        // Handle unauthorized
        useAuthStore.getState().setToken(null);
        window.location.href = '/login';
      }
      throw error;
    }
  },

  deleteProfile: async () => {
    try {
      const response = await axiosInstance.delete('/users/delete/');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/users/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      useAuthStore.getState().logout();
    }
  }
};
