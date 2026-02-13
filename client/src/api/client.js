const API_URL = import.meta.env.MODE === 'production' ? '/api' : import.meta.env.VITE_API_URL;
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError"
  }
}

export default async function apiFetch(url, options) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  const info = await res.json();
  if(!res.ok) throw new ApiError(`${info.msg || 'Something went wrong'}`, { code: res.status, text: res.statusText });
  return info;  
}