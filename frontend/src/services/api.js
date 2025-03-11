const API_URL = 'http://localhost:8000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async registerPartner(partnerData) {
    const response = await fetch(`${API_URL}/relationships/register-partner`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(partnerData),
    });
    return response.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/face-recognition/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  },

  async getBlogPosts() {
    const response = await fetch(`${API_URL}/blog/posts`, {
      headers: getHeaders(),
    });
    return response.json();
  },
}; 