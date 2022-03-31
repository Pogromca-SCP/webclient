import { baseUrl, User, NewUser } from "../helpers/apiTypes";

// Get current session role
export function getRole() {
  return fetch(`${baseUrl}/session/role`);
}

// Login request
export function login(user: Readonly<User>) {
  return fetch(`${baseUrl}/session/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(user)
  });
}

// Registers new user
export function registerUser(user: Readonly<NewUser>) {
  return fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(user)
  });
}