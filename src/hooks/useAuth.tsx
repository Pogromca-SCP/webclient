import { Roles, getRoles, stringsToRoles, login, logout } from "../helpers/authHelper";
import { createContext, useContext, useState } from "react";
import { useNotificationsManager } from "./useNotify";

// Default auth settings
const defaultContext = {
  roles: Roles.None,
  login: (token: string, roles: Readonly<string[]>, email: string) => {},
  logout: () => {}
};

// Auth hooks
const AuthContext = createContext(defaultContext);
export const useAuth = () => useContext(AuthContext);
export const useLogin = () => useAuth().login;
export const useLogout = () => useAuth().logout;
export const useRoles = () => useAuth().roles;

// Auth hook provider component
export const AuthProvider = (props: Readonly<JSX.ElementChildrenAttribute>) => {
  const [roles, setRoles] = useState(getRoles() ?? Roles.None);
  const notifications = useNotificationsManager();

  const handleLogin = (token: string, roles: Readonly<string[]>, email: string) => {
    const usr = {
      token: token,
      roles: stringsToRoles(roles),
      email: email
    };

    setRoles(usr.roles);
    login(usr);
    notifications.clear("Login.Login", "Login.LoggedInto");
  };

  const handleLogout = () => {
    setRoles(Roles.None);
    logout();
    notifications.clear("Login.LogOut", "Login.LoggedOut");
  };

  return (
    <AuthContext.Provider value={{
      roles: roles,
      login: handleLogin,
      logout: handleLogout
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};

