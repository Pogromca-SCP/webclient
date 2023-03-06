import { InnerClassParam } from "../sharedParams";
import { useDarkMode, dark } from "../../../hooks/useDarkMode";
import { Carousel as Inner } from "react-bootstrap";

// Defines carousel item properties
export interface CarouselItem {
  header: string,
  img: string,
  text?: string,
  imgAlt?: string
}

export interface CarouselParams extends InnerClassParam {
  items: CarouselItem[],
  itemClass?: string,
  imgClass?: string,
  headerClass?: string,
  textClass?: string
}

// Custom carousel component with dark mode support
const Carousel = (props: Readonly<CarouselParams>) => {
  const darkMode = useDarkMode();

  return (
    <Inner variant={darkMode ? undefined : dark} className={props.className}>
      {props.items.map((i, index) => (
        <Inner.Item className={props.itemClass} key={index}>
          <img src={i.img} alt={i.imgAlt} className={props.imgClass} />
          <Inner.Caption className={props.innerClass}>
            <h3 className={props.headerClass}>{i.header}</h3>
            {i.text ? <p className={props.textClass}>{i.text}</p> : ""}
          </Inner.Caption>
        </Inner.Item>
      ))}
    </Inner>
  );
};

export default Carousel;
