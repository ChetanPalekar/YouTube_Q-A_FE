import { api } from './api.js';

export const chatApi = {
  createSession: () => api.post('/chats', {}),
  listSessions: () => api.get('/chats'),
  getMessages: (sessionId) => api.get(`/chats/${sessionId}/messages`),
  ask: (question, sessionId) =>
    api.get(`/ask?question=${encodeURIComponent(question)}&sessionId=${sessionId}`),
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.postForm('/upload', formData);
  },
};