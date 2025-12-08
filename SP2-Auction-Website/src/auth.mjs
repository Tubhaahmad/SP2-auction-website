
const STORAGE_KEY = "artevia_user";

//get the user from localStorage//
export function getUser() {
    const saved = localStorage.getItem("artevia_user");
    return saved ? JSON.parse(saved) : null;
}

//save the user to localStorage//
export function saveUser(userData) {
    const user = {
        name: userData.name,
        email: userData.email,
        accessToken: userData.accessToken,
        credits: userData.credits || null,
        avatar: userData.avatar || null,
        banner: userData.banner || 0,
    };

    localStorage.setItem("artevia_user", JSON.stringify(user));
}

//remove user (log out)//
export function clearUser() {
    localStorage.removeItem("artevia_user");
}

//check if user is logged in//
export function isLoggedIn() {
    return Boolean(getUser()?.accessToken);
}   