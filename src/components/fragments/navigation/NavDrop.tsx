import { NavBaseParams } from "./sharedNavigationParams";
import { Link } from "react-router-dom";
import { MouseEventHandler } from "react";
import { NavDropdown } from "react-bootstrap";

export interface NavDropParams extends NavBaseParams {
  onClick?: MouseEventHandler<HTMLElement>
}

// Custom navdropdown item component
const NavDrop = (props: Readonly<NavDropParams>) => {
  return <NavDropdown.Item as={Link} to={props.to} className={`d-inline-flex align-items-center ${props.className}`} onClick={props.onClick}>{props.children}</ NavDropdown.Item>;
};

export default NavDrop;
