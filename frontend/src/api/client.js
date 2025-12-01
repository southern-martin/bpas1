import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err.message ||
      "Request failed";
    if (window.__toast?.error) {
      window.__toast.error(msg);
    }
    return Promise.reject(err);
  }
);
