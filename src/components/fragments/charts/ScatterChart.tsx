import { NamedChartDataBase, GridChartParams, customStroke } from "./sharedChartParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { ScatterChart as Inner, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, Scatter, Legend } from "recharts";
import { customTheme } from "../sharedParams";

export interface ScatterPointData {
  x: number,
  y: number,
  z: number
}

export interface ScatterChartData extends NamedChartDataBase {
  values: ScatterPointData[]
}

export interface ScatterChartParams extends GridChartParams<ScatterChartData> {
  xAxisName: string,
  xAxisUnit: string,
  yAxisName: string,
  yAxisUnit: string,
  zAxisName: string,
  zAxisUnit: string
}

// Custom scatter chart component
const ScatterChart = (props: Readonly<ScatterChartParams>) => {
  const darkMode = useDarkMode();
  const stroke = customStroke(darkMode);

  return (
    <Inner width={props.width} height={props.height} syncId={props.syncId} margin={props.margin} onClick={props.onClick}>
      {props.grid ? <CartesianGrid strokeDasharray="3 3" stroke={stroke} /> : ""}
      <XAxis dataKey="x" name={props.xAxisName} unit={props.xAxisUnit} stroke={stroke} />
      <YAxis dataKey="y" name={props.yAxisName} unit={props.yAxisUnit} stroke={stroke} />
      <ZAxis dataKey="z" name={props.zAxisName} unit={props.zAxisUnit} />
      {props.tooltip ? <Tooltip wrapperClassName={`bg-${customTheme(darkMode)}`} itemStyle={{
        color: stroke
      }} cursor={{
        stroke: stroke
        }} /> : ""}
      {props.data.map((x, index) => <Scatter name={x.name} data={x.values} fill={darkMode ? x.fillDark : x.fill} key={index} />)}
      {props.legend ? <Legend /> : ""}
    </Inner>
  );
};

export default ScatterChart;
