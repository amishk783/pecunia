import { supabase } from "@/supabaseClient";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
axiosInstance.interceptors.request.use(
  async (request) => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error(
          "No valid session found:",
          error?.message || "Session is null"
        );
        throw new Error("User is not authenticated");
      }

      const accessToken = data.session.access_token;
      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
      }

      return request;
    } catch (err) {
      console.error("Error retrieving session:", err);
      throw err;
    }
  },
  (error) => {
    // Handle other request errors
    return Promise.reject(error);
  }
);

const api = axiosInstance;

export default api;
