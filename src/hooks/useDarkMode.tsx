import { createContext, useContext, useState, useEffect } from "react";
import { getCookieValue, truth, setCookieValue } from "../helpers/cookieHelper";

// Handles theme changes for document body
const toggleBodyClasses = (isDark: boolean) => {
  const darkBackground = "bg-dark";
  const darkText = "text-dark";
  const lightBackground = "bg-light";
  const lightText = "text-light";

  if (isDark) {
    document.body.classList.add(darkBackground, lightText);
    document.body.classList.remove(lightBackground, darkText);
  } else {
    document.body.classList.add(lightBackground, darkText);
    document.body.classList.remove(darkBackground, lightText);
  }
};

// Default theme settings
const defaultContext = {
  isDark: false,
  toggle: () => {}
};

// Dark mode hooks
const DarkModeContext = createContext(defaultContext);
export const useDarkModeManager = () => useContext(DarkModeContext);
export const useDarkMode = () => useDarkModeManager().isDark;

// Additional helper consts
const darkModeCookie = "useDarkMode";
export const dark = "dark";
export const light = "light";

// Dark mode hook provider component
export const DarkModeProvider = (props: Readonly<JSX.ElementChildrenAttribute>) => {
  const [darkMode, setDarkMode] = useState(getCookieValue(darkModeCookie) === truth);

  useEffect(() => {
    setCookieValue(darkModeCookie, JSON.stringify(darkMode));
    toggleBodyClasses(darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{
      isDark: darkMode,
      toggle: () => setDarkMode(!darkMode)
    }}>
      {props.children}
    </DarkModeContext.Provider>
  );
};
