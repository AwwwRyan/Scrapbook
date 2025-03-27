import { LoginCredentials, RegisterCredentials, User } from '@/types/user';
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login/`, credentials);
      const { access } = response.data;
      console.log('Access token:', access);
      if (access) {
        localStorage.setItem('token', access);
      } else {
        console.error('Access token is missing from response');
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/create/`, credentials);
      const { access } = response.data;
      console.log('Access token:', access);
      if (access) {
        localStorage.setItem('token', access);
      } else {
        console.error('Access token is missing from response');
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/logout/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('User is not authenticated');
    }
    console.log('Token:', token);
    console.log('Updating profile with data:', userData);

    try {
      const response = await axios.put(`${API_BASE_URL}/users/edit_user/`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  deleteProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('User is not authenticated');
    }
    console.log('Token:', token);
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }
};
