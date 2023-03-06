import { NavBaseParams } from "./sharedNavigationParams";
import { useNavigate } from "react-router-dom";
import Button from "../util/Button";

export interface NavButtonParams extends NavBaseParams {
  outline?: boolean,
  disabled?: boolean
}

// Custom navigation button with dark mode support
const NavButton = (props: Readonly<NavButtonParams>) => {
  const navigate = useNavigate();
  return <Button className={props.className} onClick={() => navigate(props.to)} type="button" outline={props.outline} disabled={props.disabled}>{props.children}</Button>;
};

export default NavButton;
