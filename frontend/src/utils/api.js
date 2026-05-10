import axios from "axios";

const BASE_URL = "https://solemate.servecounterstrike.com";

axios.defaults.withCredentials = true;

// ✅ Axios instance
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

// 🔐 REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔄 RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 🔥 TOKEN EXPIRED
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        // ❌ NO REFRESH TOKEN
        if (!refresh) {
          localStorage.clear();
          window.location.replace("/login");
          return;
        }

        // 🔥 GET NEW ACCESS TOKEN
        const res = await axios.post(
          `${BASE_URL}/api/auth/refresh/`,
          {
            refresh,
          }
        );

        // ✅ SAVE NEW ACCESS TOKEN
        localStorage.setItem(
          "access",
          res.data.access
        );

        // ✅ SAVE NEW REFRESH TOKEN
        if (res.data.refresh) {
          localStorage.setItem(
            "refresh",
            res.data.refresh
          );
        }

        // 🔥 UPDATE HEADER
        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        // 🔥 RETRY ORIGINAL REQUEST
        return API(originalRequest);

      } catch (err) {

        // ❌ REFRESH FAILED
        localStorage.clear();

        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

// 🖼️ IMAGE FUNCTION
export const getImage = (url) => {

  if (!url) {
    return "https://via.placeholder.com/300?text=No+Image";
  }

  // already full URL
  if (url.startsWith("http")) {
    return url;
  }

  // normalize media path
  const cleanUrl = url.startsWith("/media/")
    ? url
    : `/media/${url}`;

  return `${BASE_URL}${cleanUrl}`;
};

// 📦 PRODUCT API
export const getProduct = (id) => {
  return API.get(`/products/${id}/`);
};

export default API;