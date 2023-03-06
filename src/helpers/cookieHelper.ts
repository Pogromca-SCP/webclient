// Helper for improved cookie handling
export const getCookieValue = (key: string) => localStorage.getItem(key) ?? "";

export const setCookieValue = (key: string, value: string) => {
  if (getCookieConsentValue()) {
    localStorage.setItem(key, value);
  }
};

export const removeCookieValue = (key: string) => localStorage.removeItem(key);
export const hasCookieValue = (key: string) => localStorage.getItem(key) !== null;
const cookieName = "cookieConsent";
export const truth = "true";
export const acceptCookies = () => localStorage.setItem(cookieName, truth);
export const getCookieConsentValue = () => localStorage.getItem(cookieName) === truth;
