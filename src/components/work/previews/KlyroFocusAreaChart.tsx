import { useEffect, useRef } from "react";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import {
  graphic,
  init as initECharts,
  use as useECharts,
  type EChartsType,
} from "echarts/core";
import { SVGRenderer } from "echarts/renderers";

useECharts([LineChart, GridComponent, SVGRenderer]);

const focusSignal = [32, 38, 36, 45, 42, 51, 48, 57, 54, 64];

export default function KlyroFocusAreaChart({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const chart: EChartsType = initECharts(element, undefined, {
      renderer: "svg",
    });

    chart.setOption({
      animation: !reduceMotion,
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { top: 4, right: 0, bottom: 0, left: 0 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        show: false,
        data: focusSignal.map((_, index) => index),
      },
      yAxis: {
        type: "value",
        show: false,
        min: 28,
        max: 68,
      },
      series: [
        {
          type: "line",
          data: focusSignal,
          smooth: 0.42,
          showSymbol: false,
          silent: true,
          lineStyle: {
            width: 2,
            color: "#f27637",
            cap: "round",
          },
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(244, 120, 55, 0.34)" },
              { offset: 0.58, color: "rgba(244, 120, 55, 0.12)" },
              { offset: 1, color: "rgba(244, 120, 55, 0)" },
            ]),
          },
          emphasis: { disabled: true },
        },
      ],
    });

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [reduceMotion]);

  return <div ref={chartRef} className="klyro-focus__chart-canvas" />;
}
