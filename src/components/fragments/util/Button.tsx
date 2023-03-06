import { ParentComponentParams, customVar } from "../sharedParams";
import { MouseEventHandler } from "react";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Button as Inner } from "react-bootstrap";

export interface ButtonParams extends ParentComponentParams {
  onClick?: MouseEventHandler<HTMLButtonElement>,
  outline?: boolean,
  type?: "button" | "reset" | "submit",
  disabled?: boolean
}

// Custom button with dark mode support
const Button = (props: Readonly<ButtonParams>) => {
  const darkMode = useDarkMode();
  return <Inner className={props.className} onClick={props.disabled ? undefined : props.onClick} variant={`${props.outline ? "outline-" : ""}${customVar(darkMode)}`} type={props.type}>{props.children}</Inner>;
};

export default Button;
