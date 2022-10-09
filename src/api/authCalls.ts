import { post } from "./basicCalls";

export interface LoginRequest {

}

export interface CreateUserRequest {

}

export interface CreateStaffRequest {

}

// Login request
export const login = (user: Readonly<LoginRequest>) => post("login", JSON.stringify(user));

// Registers new user
export const registerUser = (user: Readonly<CreateUserRequest>) => post("register/normal", JSON.stringify(user));

// Registers staff user
export const registerStaff = (user: Readonly<CreateStaffRequest>) => post("register/staff", JSON.stringify(user));
