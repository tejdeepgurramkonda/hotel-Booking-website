import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request + required user headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Add user headers for booking requests and profile endpoints
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      config.headers['X-User-Id'] = user.userId;
      config.headers['X-User-Email'] = user.email;
      console.log('📤 Request Headers:', { userId: user.userId, email: user.email, url: config.url });
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
    }
  } else {
    console.warn('⚠️ No user data in localStorage for request to:', config.url);
  }
  
  return config;
});

// Global error handling and toast notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip global toast for 'User not found' since ProfilePage handles it manually
    const status = error.response?.status;
    const isProfileCheck = error.config?.url === '/users/me' && status === 404;

    if (!isProfileCheck) {
      const message = error.response?.data?.message || 'An error occurred';     
      toast.error(message);
    }

    if (error.response && (status === 401 || status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }

    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// User
export const getMyProfile = () => api.get('/users/me');
export const createUserProfile = (data) => api.post('/users', data);
export const updateUserProfile = (id, data) => api.put(`/users/${id}`, data);

// Hotels
export const getAllHotels = (city) => api.get('/hotel', { params: city ? { city } : {} });
export const getHotel = (id) => api.get(`/hotel/${id}`);
export const addHotel = (data) => api.post('/hotel', data);
export const updateHotel = (id, data) => api.put(`/hotel/${id}`, data);
export const deleteHotel = (id) => api.delete(`/hotel/${id}`);

// Room Availability
export const getAvailability = (hotelId, roomType, startDate, endDate) =>
  api.get(`/hotel/${hotelId}/availability`, {
    params: {
      roomType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    },
  });

export const checkAvailability = (hotelId, roomType, checkIn, checkOut) =>
  api.get(`/hotel/${hotelId}/check-availability`, {
    params: {
      roomType,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
    },
  });

export const getRoomTypes = (hotelId) => api.get(`/hotel/${hotelId}/room-types`);

// Bookings
export const getAllBookings = () => api.get('/bookings');
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.put(`/bookings/cancel/${id}`);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);

export default api;
