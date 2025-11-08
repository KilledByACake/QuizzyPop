import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:5001/api" // endre port hvis backend bruker annen port
});
