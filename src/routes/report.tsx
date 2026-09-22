import { createFileRoute } from "@tanstack/react-router";
import { SolarPlatform } from "@/components/solar/SolarPlatform";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [
    { title: "能效报告 — 智慧光伏综合运营平台" },
    { name: "description", content: "汇总光伏电站能效评分、收益、碳资产与月度绩效。" },
    { property: "og:title", content: "能效报告 — 智慧光伏综合运营平台" },
    { property: "og:description", content: "汇总光伏电站能效评分、收益、碳资产与月度绩效。" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <SolarPlatform page="report" />,
});