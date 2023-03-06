import { KeyValueSizeSettings, KeyValueChartParams, KeyValueChartData, customStroke } from "./sharedChartParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Area, Bar, Line, ComposedChart as Inner, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { customTheme } from "../sharedParams";

export interface ComposedChartSettings extends KeyValueSizeSettings {
  kind?: "area" | "bar" | "line"
}

// Custom composed chart component
const ComposedChart = (props: Readonly<KeyValueChartParams<KeyValueChartData, ComposedChartSettings>>) => {
  const darkMode = useDarkMode();
  const stroke = customStroke(darkMode);

  const display = (x: ComposedChartSettings, index: number) => {
    const fill = darkMode ? x.fillDark : x.fill;

    switch (x.kind) {
      case "area":
        return <Area dataKey={`values.${x.key}`} type={x.type} stroke={x.stroke} fill={fill} fillOpacity={x.opacity} key={index} name={x.key} />;
      case "line":
        return <Line dataKey={`values.${x.key}`} type={x.type} stroke={x.stroke} key={index} name={x.key} />;
      default:
        return <Bar dataKey={`values.${x.key}`} type={x.type?.toString()} barSize={x.size && x.size > 0 ? x.size : 25} fill={fill} fillOpacity={x.opacity} key={index} name={x.key} />;
    }
  };

  return (
    <Inner width={props.width} height={props.height} data={props.data} syncId={props.syncId} margin={props.margin} onClick={props.onClick}>
      {props.grid ? <CartesianGrid strokeDasharray="3 3" stroke={stroke} /> : ""}
      <XAxis dataKey="key" stroke={stroke} />
      <YAxis stroke={stroke} />
      {props.tooltip ? <Tooltip wrapperClassName={`bg-${customTheme(darkMode)}`} cursor={{
        stroke: stroke
      }} /> : ""}
      {props.settings.map((set, index) => display(set, index))}
      {props.legend ? <Legend /> : ""}
    </Inner>
  );
};

export default ComposedChart;
