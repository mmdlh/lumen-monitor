import { createFileRoute } from "@tanstack/react-router";
import { SolarPlatform } from "@/components/solar/SolarPlatform";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "运营总览 — 智慧光伏综合运营平台" },
    { name: "description", content: "集中查看光伏电站发电、收益、设备健康与实时告警。" },
    { property: "og:title", content: "运营总览 — 智慧光伏综合运营平台" },
    { property: "og:description", content: "集中查看光伏电站发电、收益、设备健康与实时告警。" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <SolarPlatform page="overview" />,
});
