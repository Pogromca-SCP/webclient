import { KeyValueChartParams, SingleKeyValueChartData, KeyValueChartSettings, customStroke } from "./sharedChartParams";
import { AxisDomain } from "recharts/types/util/types";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { RadarChart as Inner, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Radar, Legend } from "recharts";
import { customTheme } from "../sharedParams";

export interface RadarChartParams extends KeyValueChartParams<SingleKeyValueChartData, KeyValueChartSettings> {
  innerRadius?: number,
  outerRadius?: number,
  angle?: number,
  domain?: AxisDomain
}

// Custom radar chart component
const RadarChart = (props: Readonly<RadarChartParams>) => {
  const darkMode = useDarkMode();
  const stroke = customStroke(darkMode);

  return (
    <Inner width={props.width} height={props.height} data={props.data} syncId={props.syncId} margin={props.margin} onClick={props.onClick} innerRadius={props.innerRadius} outerRadius={props.outerRadius}>
      {props.grid ? <PolarGrid stroke={stroke} /> : ""}
      <PolarAngleAxis dataKey="key" stroke={stroke} />
      <PolarRadiusAxis angle={props.angle} domain={props.domain} stroke={stroke} />
      {props.tooltip ? <Tooltip wrapperClassName={`bg-${customTheme(darkMode)}`} cursor={{
        stroke: stroke
      }} /> : ""}
      {props.settings.map((set, index) => <Radar dataKey={`values.${set.key}`} stroke={set.stroke} fill={darkMode ? set.fillDark : set.fill} fillOpacity={set.opacity} key={index} name={set.key} />)}
      {props.legend ? <Legend /> : ""}
    </Inner>
  );
};

export default RadarChart;
