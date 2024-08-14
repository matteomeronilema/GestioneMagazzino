import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
  return config;
}, error => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  async error => {
    console.error('API Response Error:', error.response ? error.response.status : 'No Response', error.message);
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('Attempting to refresh token');
        const response = await axios.post('http://localhost:3001/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('Token refreshed successfully');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.reload();
        return Promise.reject(refreshError);
      }
    }
    if (error.response && error.response.status === 403) {
      console.error('Access forbidden. Clearing tokens and reloading.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;