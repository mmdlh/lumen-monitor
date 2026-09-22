import { createFileRoute } from "@tanstack/react-router";
import { SolarPlatform } from "@/components/solar/SolarPlatform";

export const Route = createFileRoute("/analysis")({
  head: () => ({ meta: [
    { title: "发电分析 — 智慧光伏综合运营平台" },
    { name: "description", content: "分析发电达成、损耗结构、预测准确率与电站绩效。" },
    { property: "og:title", content: "发电分析 — 智慧光伏综合运营平台" },
    { property: "og:description", content: "分析发电达成、损耗结构、预测准确率与电站绩效。" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <SolarPlatform page="analysis" />,
});