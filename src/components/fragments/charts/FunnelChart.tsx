import { ChartBaseParams, NamedChartData, customStroke } from "./sharedChartParams";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { FunnelChart as Inner, Funnel, LabelList, Tooltip } from "recharts";
import { customTheme } from "../sharedParams";

export interface FunnelChartParams extends ChartBaseParams<NamedChartData> {
  animation?: boolean,
  legendOnLeft?: boolean
}

// Custom funnel chart component
const FunnelChart = (props: Readonly<FunnelChartParams>) => {
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
      <Funnel data={data} nameKey="name" dataKey="value" isAnimationActive={props.animation}>
        {props.legend ? <LabelList position={props.legendOnLeft ? "left" : "right"} fill={stroke} stroke="none" dataKey="name" /> : ""}
      </Funnel>
      {props.tooltip ? <Tooltip wrapperClassName={`bg-${customTheme(darkMode)}`} itemStyle={{
        color: stroke
      }} cursor={{
        stroke: stroke
      }} /> : ""}
    </Inner>
  );
};

export default FunnelChart;
