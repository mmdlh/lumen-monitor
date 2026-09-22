import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

export default function SolarChart({ option, height = 240 }: { option: EChartsOption; height?: number }) {
  return (
    <ReactECharts
      option={{
        backgroundColor: "transparent",
        animationDuration: 900,
        textStyle: { fontFamily: "Hind, sans-serif", color: "#b8cbe0" },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(7,17,31,.94)",
          borderColor: "rgba(20,184,212,.45)",
          textStyle: { color: "#eaf7ff" },
        },
        ...option,
      }}
      style={{ height, width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge
      lazyUpdate
    />
  );
}