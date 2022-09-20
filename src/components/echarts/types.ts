import { EChartsCoreOption, ECharts } from 'echarts';

export interface EchartsProps {
  width: number;
  height: number;
  echartOptions: EChartsCoreOption;
  themeType?: string;
  eventHandlers?: EventHandlers;
  zrEventHandlers?: EventHandlers;
  selectedValues?: Record<number, string>;
  forceClear?: boolean;
}

export interface EchartsHandler {
  getEchartInstance: () => ECharts | undefined;
}

export type EventHandlers = Record<string, { (props: any): void }>;
