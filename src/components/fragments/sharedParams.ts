// Contains type definitions shared in fragment components
import { ReactChild, ReactChildren } from "react";
import { dark, light } from "../../hooks/useDarkMode";

export type ChildrenType = ReactChild | ReactChildren | ReactChild[] | ReactChildren[];

export interface ClassNameParam {
  className?: string
}

export interface InnerClassParam extends ClassNameParam {
  innerClass?: string
}

export interface ParentComponentParams extends ClassNameParam {
  children?: ChildrenType
}

export const customTheme = (darkMode: boolean) => darkMode ? dark : light;
export const customVar = (darkMode: boolean) => `custom-${customTheme(darkMode)}`;

export interface ValueViewParams {
  value: string
}
