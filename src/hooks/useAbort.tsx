import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Default abort settings
const defaultContext = {
  abort: new AbortController()
};

// Abort requests hooks
const AbortContext = createContext(defaultContext);
export const useAbort = () => useContext(AbortContext).abort;

// Popup hook provider component
export const AbortProvider = (props: Readonly<JSX.ElementChildrenAttribute>) => {
  const [abort, setAbort] = useState(new AbortController());
  const location = useLocation();
  
  useEffect(() => {
    const tmp = new AbortController();
    setAbort(tmp);
    return () => tmp.abort();
  }, [location]);

  return (
    <AbortContext.Provider value={{
      abort: abort
    }}>
      {props.children}
    </AbortContext.Provider>
  );
};
