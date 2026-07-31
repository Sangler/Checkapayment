import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  // Required so the browser sends/receives the HTTP-only `session_token`
  // cookie set by the backend after a successful login/verification flow.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});