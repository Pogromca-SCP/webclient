import { NavBaseParams, customLink } from "./sharedNavigationParams";
import { Link as Inner } from "react-router-dom";
import { useDarkMode } from "../../../hooks/useDarkMode";

// Custom link with dark mode support
const Link = (props: Readonly<NavBaseParams>) => {
  const darkMode = useDarkMode();
  return <Inner to={props.to} className={`${customLink(darkMode)} ${props.className}`}>{props.children}</Inner>;
};

export default Link;
