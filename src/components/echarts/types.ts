import { EChartsCoreOption, ECharts } from 'echarts';

export interface EchartsProps {
  echartOptions: EChartsCoreOption;
  className?: string;
  width?: number | 'auto';
  height?: number;
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
