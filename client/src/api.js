import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (username, password) => api.post('/auth/login', { username, password });
export const register = (username, password) => api.post('/auth/register', { username, password });

// Tags
export const getTags = () => api.get('/tags');
export const createTag = (name) => api.post('/tags', { name });
export const deleteTag = (id) => api.delete(`/tags/${id}`);
export const getItemsByTag = (tagId) => api.get(`/tags/${tagId}/items`);

// Notes
export const getNotes = (date) => api.get('/notes', { params: { date } });
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Todos
export const getTodos = (includeCompleted, notInCalendar) =>
  api.get('/todos', { params: { includeCompleted, notInCalendar } });
export const getTodosByNote = (noteId) => api.get(`/notes/${noteId}/todos`);
export const createTodo = (data) => api.post('/todos', data);
export const updateTodo = (id, data) => api.put(`/todos/${id}`, data);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);

export default api;
