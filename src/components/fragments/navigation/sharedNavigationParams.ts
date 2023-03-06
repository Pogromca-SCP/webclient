// Contains type definitions shared in navigation components
import { ParentComponentParams, customTheme } from "../sharedParams";
import { To } from "react-router-dom";

export interface NavBaseParams extends ParentComponentParams {
  to: To
}

export const customLink = (darkMode: boolean) => `link-${customTheme(darkMode)}`;
