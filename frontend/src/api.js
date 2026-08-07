import axios from "axios";

// In production (served by Express + Nginx) use relative /api path.
// In dev, Vite proxy (see vite.config.js) forwards /api to backend on :5000
const api = axios.create({
  baseURL: "/api",
});

export const getPosts = () => api.get("/posts");
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post("/posts", data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export default api;
