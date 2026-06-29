import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login: data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
}

export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: data => api.put('/users/me', data),
  deleteMe: () => api.delete('/users/me'),
}

export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: id => api.get(`/transactions/${id}`),
  create: data => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: id => api.delete(`/transactions/${id}`),
}

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getCategories: () => api.get('/analytics/categories'),
  getMonthly: () => api.get('/analytics/monthly'),
}

export const budgetAPI = {
  getAll: (month) => api.get('/budgets', { params: month ? { month } : {} }),
  createOrUpdate: data => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: id => api.delete(`/budgets/${id}`),
}

export default api
