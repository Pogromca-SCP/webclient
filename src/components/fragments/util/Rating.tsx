import Inner from "react-rating";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

export interface RatingParams {
  initialValue?: number,
  disabled?: boolean,
  onChange?: (x: number) => void,
  onClick?: (x: number) => void,
  onHover?: (x: number) => void
}

// Custom 5-star rating component
const Rating = (props: Readonly<RatingParams>) => {
  const calcRating = (x: number) => {
    const floored = Math.floor(x);
    return x % floored >= 0.5 ? floored + 0.5 : floored;
  };

  return <Inner emptySymbol={<AiOutlineStar size={35} />} fullSymbol={<AiFillStar size={35} />} onClick={props.onClick} onChange={props.onChange} onHover={props.onHover} initialRating={props.initialValue && props.initialValue > 0 ? calcRating(props.initialValue) : 0} readonly={props.disabled} />;
};

export default Rating;
