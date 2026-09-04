import axios from "axios";

const api = axios.create({
  baseURL: "http://riori-backend.test",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
