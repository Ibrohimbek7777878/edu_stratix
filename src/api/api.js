import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. So'rovdan oldin tokenni qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Javobni tekshirish va Tokenni YANGILASH (Refresh Logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 xato kelsa va bu bizning birinchi urinishimiz bo'lsa
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Login va Register sahifalarida bu qoida ishlamasligi kerak
      if (
        window.location.pathname.includes("/login") ||
        window.location.pathname.includes("/signup")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Cheksiz siklga tushmaslik uchun belgi qo'yamiz

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          // Backenddan yangi token so'raymiz
          const response = await axios.post(
            `${BASE_URL}/users/token/refresh/`,
            {
              refresh: refreshToken,
            },
          );

          // Yangi tokenni saqlaymiz
          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);

          // Eski so'rovni yangi token bilan qayta yuboramiz
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Agar Refresh token ham eskirgan bo'lsa, unda Loginga haydaymiz
        console.error("Session tugadi. Qayta kiring.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
