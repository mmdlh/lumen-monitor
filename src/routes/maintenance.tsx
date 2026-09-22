import { createFileRoute } from "@tanstack/react-router";
import { SolarPlatform } from "@/components/solar/SolarPlatform";

export const Route = createFileRoute("/maintenance")({
  head: () => ({ meta: [
    { title: "智能运维 — 智慧光伏综合运营平台" },
    { name: "description", content: "通过智能诊断、预测性维护和工单协同提升光伏运维效率。" },
    { property: "og:title", content: "智能运维 — 智慧光伏综合运营平台" },
    { property: "og:description", content: "通过智能诊断、预测性维护和工单协同提升光伏运维效率。" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <SolarPlatform page="maintenance" />,
});