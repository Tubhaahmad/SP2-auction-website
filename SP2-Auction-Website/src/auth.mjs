const USER_KEY = "user";
const TOKEN_KEY = "token";

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  const token = getToken();
  return !!token;
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("username");
}


export function logoutUser() {
    localStorage.removeItem("artevia_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

//save user data back to localStorage after profile fetch or updates//
export function saveUserData(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
}