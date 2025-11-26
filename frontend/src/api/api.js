import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8000", // URL backend FastAPI
});

// ===== Interceptor untuk otomatis kirim token =====
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===== UNIVERSAL LOGIN (tanpa role manual) =====
export const loginUser = async ({ email, password }) => {
  const data = new URLSearchParams();
  data.append("username", email); // FastAPI OAuth2 expects 'username'
  data.append("password", password);

  return API.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

// ===== UNIVERSAL REGISTER (otomatis jadi 'user' di backend) =====
export const registerUser = async ({ email, password }) => {
  return API.post("/auth/register", { email, password });
};

export default API;
