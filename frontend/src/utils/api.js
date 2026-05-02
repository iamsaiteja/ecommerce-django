import axios from "axios";

// ✅ BASE URL (correct)
const BASE_URL = "https://solemate.servecounterstrike.com";

// ✅ AXIOS INSTANCE (correct)
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});


// ✅ REQUEST INTERCEPTOR (TOKEN ADD)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ✅ RESPONSE INTERCEPTOR (TOKEN REFRESH)
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ❌ POSSIBLE BUG: originalRequest undefined case handle cheyyaledu
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ✅ 401 error check
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        // ❌ IF refresh null → crash avuthundi
        if (!refresh) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const res = await axios.post(
          `${BASE_URL}/api/auth/refresh/`,
          { refresh }
        );

        // ✅ SAVE NEW TOKEN
        localStorage.setItem("access", res.data.access);

        // ✅ UPDATE HEADER
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        // ✅ RETRY ORIGINAL REQUEST
        return API(originalRequest);

      } catch (err) {
        // ❌ refresh fail → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


// ✅ GET SINGLE PRODUCT (correct)
export const getProduct = (id) => {
  return API.get(`/products/${id}/`);
};


// ✅ IMAGE FIX FUNCTION (THIS IS YOUR HERO 🔥)
export const getImage = (url) => {

  // ❌ if null → blank box problem
  if (!url) {
    return "https://via.placeholder.com/300?text=No+Image";
  }

  // ✅ S3 URL already full → return as it is
  if (url.startsWith("http")) {
    return url;
  }

  // ✅ fallback (for local media)
  return `${BASE_URL}${url}`;
};


// ✅ DEFAULT EXPORT (MANDATORY — YOU MISSED THIS BEFORE 💀)
export default API;