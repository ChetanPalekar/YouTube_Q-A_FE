const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // sends the httpOnly auth cookie automatically
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  postForm: async (path, formData) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // no Content-Type header — browser sets multipart boundary automatically
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `Request failed: ${response.status}`);
    }
    return response.json();
  },
};