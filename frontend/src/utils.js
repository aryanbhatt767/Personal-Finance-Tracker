export const fmt = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`

export const fmtDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

export const getCategoryColor = (category) => {
  const map = {
    Food: '#ef4444', Transport: '#3b82f6', Shopping: '#ec4899',
    Entertainment: '#6c63ff', Utilities: '#f59e0b', Health: '#14b8a6',
    Housing: '#8b5cf6', Income: '#22c55e', Other: '#888888',
  }
  return map[category] || '#6c63ff'
}

export const getCategoryIcon = (category) => {
  const map = {
    Food: '🍔', Transport: '🚗', Shopping: '👗', Entertainment: '🎬',
    Utilities: '⚡', Health: '🏋️', Housing: '🏠', Income: '💼', Other: '💳',
  }
  return map[category] || '💳'
}
