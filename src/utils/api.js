const BASE = "http://localhost:8080/event-mng";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });
  
  if (res.status === 401) {
    // Optionally handle logout or token refresh
  }

  return res.json();
}

export const API_BASE = BASE;
