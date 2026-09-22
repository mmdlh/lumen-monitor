import { createFileRoute } from "@tanstack/react-router";
import { SolarPlatform } from "@/components/solar/SolarPlatform";

export const Route = createFileRoute("/monitor")({
  head: () => ({ meta: [
    { title: "实时监控 — 智慧光伏综合运营平台" },
    { name: "description", content: "实时监控光伏电站并网、气象、储能与通信状态。" },
    { property: "og:title", content: "实时监控 — 智慧光伏综合运营平台" },
    { property: "og:description", content: "实时监控光伏电站并网、气象、储能与通信状态。" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <SolarPlatform page="monitor" />,
});