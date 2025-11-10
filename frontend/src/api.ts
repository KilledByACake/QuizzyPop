import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5239", // Changed from 5000 to 5239
  headers: {
    "Content-Type": "application/json",
  },
});
