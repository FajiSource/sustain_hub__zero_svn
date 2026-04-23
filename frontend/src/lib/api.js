import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sustainhub_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message ?? "Request failed. Please try again.";

    window.dispatchEvent(
      new CustomEvent("app:toast", {
        detail: { type: "error", message },
      })
    );

    if (status === 401) {
      localStorage.removeItem("sustainhub_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
