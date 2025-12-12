import { getUser } from "./auth.mjs";

export const API_BASE = "https://v2.api.noroff.dev";

export async function apiRequest(endpoint, options = {}) {
  const user = getUser();

  const settings = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(user?.accessToken
        ? { Authorization: `Bearer ${user.accessToken}` }
        : {}),
    },
  };

  if (options.body) {
    settings.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, settings);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "API request failed");
  }
  return data;
}
