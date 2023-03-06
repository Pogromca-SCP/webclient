export interface DateDisplayParams {
  value: Date
}

const DateDisplay = (props: Readonly<DateDisplayParams>) => {
  const dualNum = (x: number) => x > 9 ? x.toString() : `0${x}`;
  return <>{`${dualNum(props.value.getDate())}-${dualNum(props.value.getMonth() + 1)}-${props.value.getFullYear()} ${dualNum(props.value.getHours())}:${dualNum(props.value.getMinutes())}`}</>;
};

export default DateDisplay;
