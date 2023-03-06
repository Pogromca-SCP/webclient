import { To, NavLink } from "react-router-dom";
import { InnerClassParam, customTheme } from "../sharedParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Nav } from "react-bootstrap";
import { customLink } from "./sharedNavigationParams";

export interface NavTarget {
  to: To,
  text: string
}

export interface NavtabParams extends InnerClassParam {
  links: NavTarget[],
  linkClass?: string
}

// Custom navigation tab component with dark mode support
const Navtab = (props: Readonly<NavtabParams>) => {
  const darkMode = useDarkMode();

  return (
    <Nav variant="tabs" className={`navtab-${customTheme(darkMode)} ${props.className} d-fixed`}>
      {props.links.map((link, index) => (
        <Nav.Item key={index} className={props.innerClass}>
          <Nav.Link as={NavLink} to={link.to} className={`navtab-${customLink(darkMode)} ${props.linkClass}`}>{link.text}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Navtab;
