export const request = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '请求失败')
  }

  return data
}