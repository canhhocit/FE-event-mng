import { useCallback } from "react";

const BASE = "http://localhost:8080/event-mng";

export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  // Nếu BE chỉ trả về tên file hoặc path tương đối (start with /), ta nối với BASE
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

export function useApi() {
  const token = localStorage.getItem("token");

  const get = useCallback(
    (path) =>
      fetch(`${BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    [token]
  );

  const post = useCallback(
    (path, body) => {
      const isFormData = body instanceof FormData;
      return fetch(`${BASE}${path}`, {
        method: "POST",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${token}`,
        },
        body: isFormData ? body : JSON.stringify(body),
      }).then((r) => r.json());
    },
    [token]
  );

  const put = useCallback(
    (path, body) => {
      const isFormData = body instanceof FormData;
      return fetch(`${BASE}${path}`, {
        method: "PUT",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${token}`,
        },
        body: isFormData ? body : JSON.stringify(body),
      }).then((r) => r.json());
    },
    [token]
  );

  // Dùng cho PATCH — chỉ cập nhật 1 field (vd: status)
  const patch = useCallback(
    (path) =>
      fetch(`${BASE}${path}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    [token]
  );

  const del = useCallback(
    (path) =>
      fetch(`${BASE}${path}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    [token]
  );

  return { get, post, put, patch, del };
}