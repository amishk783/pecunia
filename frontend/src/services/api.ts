
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const updateAxiosToken = (token: string | null) => {
  if (!token) delete api.defaults.headers.common["Authorization"];

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};



const api = axiosInstance;

export default api;
