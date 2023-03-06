import { ParentComponentParams } from "../sharedParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { customLink } from "./sharedNavigationParams";

export interface ItemLinkParams extends ParentComponentParams {
  to: string,
}

// Custom link to an element on current page
const ItemLink = (props: Readonly<ItemLinkParams>) => {
  const darkMode = useDarkMode();
  return <a href={`#${props.to}`} className={`${customLink(darkMode)} ${props.className}`}>{props.children}</a>;
};

export default ItemLink;
