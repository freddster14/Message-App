export default async function apiFetch(url, options) {
  try {
    const res = await fetch(`${import.meta.env.API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if(!res.ok) throw new Error(`Response: ${res}`);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}