import { ChartBaseParams, NamedChartData, customStroke } from "./sharedChartParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { PieChart as Inner, Pie, Tooltip, Legend } from "recharts";
import { customTheme } from "../sharedParams";

export interface PieChartParams extends ChartBaseParams<NamedChartData> {
  label?: boolean,
  innerRadius?: string | number
}

// Custom pie chart component
const PieChart = (props: Readonly<PieChartParams>) => {
  const darkMode = useDarkMode();
  const stroke = customStroke(darkMode);

  const data = props.data.map(x => {
    return {
      name: x.name,
      value: x.value,
      fill: darkMode ? x.fillDark : x.fill
    };
  });

  return (
    <Inner width={props.width} height={props.height} syncId={props.syncId} margin={props.margin} onClick={props.onClick}>
      <Pie data={data} nameKey="name" dataKey="value" cx="50%" cy="50%" label={props.label} innerRadius={props.innerRadius} />
      {props.tooltip ? <Tooltip wrapperClassName={`bg-${customTheme(darkMode)}`} itemStyle={{
        color: stroke
      }} cursor={{
        stroke: stroke
      }} /> : ""}
      {props.legend ? <Legend /> : ""}
    </Inner>
  );
};

export default PieChart;
