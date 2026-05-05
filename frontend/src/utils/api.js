import axios from "axios";

const BASE_URL = "https://ecommerce-django-umber.vercel.app";

export const getImage = (path) => {
  if (!path) return "";
  return `${BASE_URL}${path}`;
};

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

// 🔐 Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const res = await axios.post(
          `${BASE_URL}/api/auth/refresh/`,
          { refresh }
        );

        localStorage.setItem("access", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return API(originalRequest);

      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// 📦 Product API
export const getProduct = (id) => {
  return API.get(`/products/${id}/`);
};

// 🖼️ Image handler (VERY IMPORTANT FIX)
export const getImage = (url) => {
  if (!url) return "https://via.placeholder.com/300?text=No+Image";

  // already full URL
  if (url.startsWith("http")) return url;

  // correct case
  if (url.startsWith("/media/")) {
    return `${BASE_URL}${url}`;
  }

  // FINAL FIX (most important)
  return `${BASE_URL}/media/${url}`;
};

// ⭐ FINAL LINE (DON'T TOUCH)
export default API;