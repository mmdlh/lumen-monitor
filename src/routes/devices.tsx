import { createFileRoute } from "@tanstack/react-router";
import { SolarPlatform } from "@/components/solar/SolarPlatform";

export const Route = createFileRoute("/devices")({
  head: () => ({ meta: [
    { title: "设备管理 — 智慧光伏综合运营平台" },
    { name: "description", content: "管理逆变器、组件、储能与并网设备的健康状态和台账。" },
    { property: "og:title", content: "设备管理 — 智慧光伏综合运营平台" },
    { property: "og:description", content: "管理逆变器、组件、储能与并网设备的健康状态和台账。" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <SolarPlatform page="devices" />,
});