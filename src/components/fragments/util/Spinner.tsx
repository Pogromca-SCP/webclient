import { ClassNameParam, customVar } from "../sharedParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Spinner as Inner } from "react-bootstrap";

export interface SpinnerParams extends ClassNameParam {
  grow?: boolean
}

// Custom spinner with dark mode support
const Spinner = (props: Readonly<SpinnerParams>) => {
  const darkMode = useDarkMode();
  return <Inner animation={props.grow ? "grow" : "border"} className={props.className} variant={customVar(darkMode)} />;
};

export default Spinner;
