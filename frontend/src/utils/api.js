import axios from 'axios';


const BASE_URL = "http://solemate.servecounterstrike.com";


const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');

        // CALL REFRESH API
        const res = await axios.post(
          `${BASE_URL}/api/auth/refresh/`,
          { refresh }
        );

        // Save new access token
        localStorage.setItem('access', res.data.access);

        // Update header
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        //  Retry original request
        return API(originalRequest);

      } catch (err) {

        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;