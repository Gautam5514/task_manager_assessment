export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
    USERS: `${API_URL}/api/auth/users`,
  },
  TASKS: `${API_URL}/api/tasks`,
  NOTIFICATIONS: {
    BASE: `${API_URL}/api/notifications`,
    READ: (id: string) => `${API_URL}/api/notifications/${id}/read`,
  },
};
