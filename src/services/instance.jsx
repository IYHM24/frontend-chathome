import { Salir } from "@/utils/AuthConfig";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACK_URL || "http://localhost:5069";
//const API_URL_SERVICE = import.meta.env.VITE_SERVICE_URL || "https://pruebas-01.grupogss.com.co/service";

export const getAnyApiInstance = (URL) => {
  return axios.create({
    baseURL: URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 300000,
  });
}

export const axionsInstanceBearer = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 300000,
});
export const axiosInstanceFormData = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
})

// Add a response interceptor
axionsInstanceBearer.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      Salir();
    } else if (error.message && error.message.includes("ERR_CONNECTION_REFUSED")) {
      // Handle connection refused error
      console.error("Connection refused. Please check the server.");
    }
    return Promise.reject(error);
  }
);

export const ConfigToken = (token_entrante) => {
  axionsInstanceBearer.defaults.headers.common['Authorization'] = `Bearer ${token_entrante}`;
}




