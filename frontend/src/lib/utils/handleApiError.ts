import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { toast } from 'react-hot-toast';

export const handleApiError = (error: any, router: any) => {
  if (error?.response?.status === 401) {
    // Clear all auth data
    localStorage.removeItem('token');
    useAuthStore.getState().setToken(null);
    
    // Store current path for redirect after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    toast.error('Session expired. Please login again.');
    router.push('/login');
    return true;
  }
  return false;
}; 