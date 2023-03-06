import { ParentComponentParams, customVar } from "../sharedParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Alert as Inner } from "react-bootstrap";

// Custom alert component with dark mode support
const Alert = (props: Readonly<ParentComponentParams>) => {
  const darkMode = useDarkMode();
  return <Inner className={props.className} variant={customVar(darkMode)}>{props.children}</Inner>;
};

export default Alert;
