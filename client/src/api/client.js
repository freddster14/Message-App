export default async function apiFetch(url, options) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || 'Server');
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}