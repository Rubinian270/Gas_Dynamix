import axios from 'axios';

const API_URL = 'https://gaxmixer-production.up.railway.app';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const api = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // For now, we'll return the first user as the logged-in user
      // In a real app, you would have a way to identify the current user
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}; 