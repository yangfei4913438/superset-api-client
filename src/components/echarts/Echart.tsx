import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { ECharts, init, registerTheme } from 'echarts';
import { EchartsHandler, EchartsProps } from './types';
import choiceForm from './themes/choiceform.json';
import ringPie from './themes/ringPie.json';
import customBar from './themes/customBar.json';

function Echart(
  {
    width,
    height,
    themeType = choiceForm.themeName,
    echartOptions,
    eventHandlers,
    zrEventHandlers,
    selectedValues = {},
  }: EchartsProps,
  ref: React.Ref<EchartsHandler>
) {
  const divRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts>();
  const currentSelection = useMemo(() => Object.keys(selectedValues) || [], [selectedValues]);
  const previousSelection = useRef<string[]>([]);
  const lastTheme = useRef<string>();

  useImperativeHandle(ref, () => ({
    getEchartInstance: () => chartRef.current,
  }));

  useEffect(() => {
    // 注册多种主题
    registerTheme(choiceForm.themeName, choiceForm.theme);
    registerTheme(ringPie.themeName, ringPie.theme);
    registerTheme(customBar.themeName, customBar.theme);
  }, []);

  const options = useMemo(() => {
    const { toolbox = { feature: {} }, ...baseOptions } = echartOptions;
    return {
      ...baseOptions,
      toolbox: {
        // @ts-ignore
        ...toolbox,
        show: true,
        feature: {
          // @ts-ignore
          ...toolbox?.feature,
          dataView: { readOnly: true },
        },
      },
    };
  }, [echartOptions]);

  useEffect(() => {
    if (!divRef.current) return;
    if (!chartRef.current) {
      lastTheme.current = themeType;
      // 初始化
      chartRef.current = init(divRef.current, themeType);
    }

    Object.entries(eventHandlers || {}).forEach(([name, handler]) => {
      chartRef.current?.off(name);
      chartRef.current?.on(name, handler);
    });

    Object.entries(zrEventHandlers || {}).forEach(([name, handler]) => {
      chartRef.current?.getZr().off(name);
      chartRef.current?.getZr().on(name, handler);
    });

    chartRef.current?.setOption(options, true, true);
  }, [options, eventHandlers, zrEventHandlers, themeType]);

  useEffect(() => {
    // 只有主题变化才会触发更新
    if (chartRef.current && divRef.current && lastTheme.current !== themeType) {
      lastTheme.current = themeType;
      chartRef.current?.clear();
      chartRef.current?.dispose();
      chartRef.current = init(divRef.current, themeType);
      chartRef.current.setOption(options, true, true);
      chartRef.current.resize({ width, height });
    }
  }, [height, options, themeType, width]);

  // highlighting
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.dispatchAction({
      type: 'downplay',
      dataIndex: previousSelection.current.filter((value) => !currentSelection.includes(value)),
    });
    if (currentSelection.length) {
      chartRef.current.dispatchAction({
        type: 'highlight',
        dataIndex: currentSelection,
      });
    }
    previousSelection.current = currentSelection;
  }, [currentSelection]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize({ width, height });
    }
  }, [width, height]);

  return <div ref={divRef} style={{ width, height }} />;
}

export default forwardRef(Echart);
