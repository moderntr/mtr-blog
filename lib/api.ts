// @/lib/api/index.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),

  getMe: () => api.get("/auth/me"),

  googleAuth: (userData: any) => api.post("/auth/google", userData),
};

// Posts API
export const postsAPI = {
  getPosts: (params?: any) => api.get("/posts", { params }),

  getPost: (idOrSlug: string) => api.get(`/posts/${idOrSlug}`),

  createPost: (postData: any) => api.post("/posts", postData),

  updatePost: (id: string, postData: any) => api.put(`/posts/${id}`, postData),

  deletePost: (id: string) => api.delete(`/posts/${id}`),

  toggleLikePost: (id: string) => api.post(`/posts/${id}/toggle-like`),

  getFeaturedPosts: () => api.get("/posts/featured"),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get("/categories"),

  getCategory: (idOrSlug: string) => api.get(`/categories/${idOrSlug}`),

  createCategory: (categoryData: any) => api.post("/categories", categoryData),

  updateCategory: (id: string, categoryData: any) =>
    api.put(`/categories/${id}`, categoryData),

  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

export const commentsAPI = {
  getComments: (params?: any) => api.get("/comments", { params }),

  getPostComments: (postId: string, params?: any) =>
    api.get(`/comments/post/${postId}`, { params }),

  createComment: (commentData: any) => api.post("/comments", commentData),

  likeComment: (id: string) => api.post(`/comments/${id}/like`),

  deleteComment: (id: string) => api.delete(`/comments/${id}`),

  updateCommentStatus: (commentId: string, status: string) =>
    api.patch(`/comments/${commentId}/status`, { status }),
};

// Users API
export const usersAPI = {
  getUsers: (params?: any) => api.get("/users", { params }),

  getUser: (id: string) => api.get(`/users/${id}`),

  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),

  updateUserRole: (id: string, role: string) =>
    api.put(`/users/${id}/role`, { role }),

  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export default api;
