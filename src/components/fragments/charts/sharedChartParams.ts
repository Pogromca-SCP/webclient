// Contains type definitions shared in chart components
import { CurveType } from "recharts/types/shape/Curve";
import { Margin } from "recharts/types/util/types";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { customTheme } from "../sharedParams";

export interface KeyParam {
  key: string
}

export interface KeyValueChartData extends KeyParam {
  values: Record<string, number | number[]>
}

export interface SingleKeyValueChartData extends KeyParam {
  values: Record<string, number>
}

export interface KeyValueChartSettings extends KeyParam {
  stroke?: string,
  fill?: string,
  fillDark?: string,
  opacity?: string | number,
}

export interface KeyValueCurveSettings extends KeyValueChartSettings {
  type?: CurveType
}

export interface KeyValueSizeSettings extends KeyValueCurveSettings {
  size?: number
}

export interface BareBonesChartParams {
  width: number,
  height: number,
  syncId?: string | number,
  margin?: Margin,
  onClick?: CategoricalChartFunc
}

export interface ChartBaseParams<T> extends BareBonesChartParams {
  data: T[],
  tooltip?: boolean,
  legend?: boolean,
}

export interface GridChartParams<T> extends ChartBaseParams<T> {
  grid?: boolean
}

export interface KeyValueChartParams<T, S> extends GridChartParams<T> {
  settings: S[]
}

export interface NamedChartDataBase {
  name: string,
  fill: string,
  fillDark: string
}

export interface NamedChartData extends NamedChartDataBase {
  value: number
}

export const customStroke = (darkMode: boolean) => `var(--${customTheme(darkMode)}-text)`;
