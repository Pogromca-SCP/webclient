import { NavBaseParams, customLink } from "./sharedNavigationParams";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Nav } from "react-bootstrap";

// Custom navigation link with dark mode support
const NavLink = (props: Readonly<NavBaseParams>) => {
  const darkMode = useDarkMode();
  return <Nav.Link as={Link} to={props.to} className={`d-inline-flex align-items-center nav-${customLink(darkMode)} ${props.className}`}>{props.children}</Nav.Link>;
};

export default NavLink;
