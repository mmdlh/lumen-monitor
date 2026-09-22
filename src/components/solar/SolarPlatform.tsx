import { ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
import type { EChartsOption } from "echarts";
import {
  Activity,
  BarChart3,
  BatteryCharging,
  CircleDollarSign,
  Cpu,
  FileChartColumn,
  Gauge,
  LayoutDashboard,
  RadioTower,
  ShieldCheck,
  Sparkles,
  SunMedium,
  ThermometerSun,
  TriangleAlert,
  Wrench,
  Zap,
} from "lucide-react";
import solarBackground from "@/assets/solar-command-background.jpg";

const SolarChart = lazy(() => import("./SolarChart.client"));

export type SolarPage = "overview" | "monitor" | "analysis" | "devices" | "maintenance" | "report";

const pages: Array<{ key: SolarPage; path: string; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: "overview", path: "/", label: "运营总览", icon: LayoutDashboard },
  { key: "monitor", path: "/monitor", label: "实时监控", icon: RadioTower },
  { key: "analysis", path: "/analysis", label: "发电分析", icon: BarChart3 },
  { key: "devices", path: "/devices", label: "设备管理", icon: Cpu },
  { key: "maintenance", path: "/maintenance", label: "智能运维", icon: Wrench },
  { key: "report", path: "/report", label: "能效报告", icon: FileChartColumn },
];

const cyan = "#14B8D4";
const gold = "#FFC857";
const blue = "#3788d8";
const green = "#39d9a0";
const danger = "#ff6b6b";
const axis = { axisLine: { lineStyle: { color: "rgba(184,203,224,.18)" } }, axisTick: { show: false }, axisLabel: { color: "#7890a8", fontSize: 10 } };
const baseGrid = { left: 42, right: 20, top: 56, bottom: 30, containLabel: false };
const times = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];
const power = [18, 15, 13, 25, 118, 286, 418, 486, 453, 328, 138, 42];
const forecast = [16, 14, 15, 31, 126, 301, 432, 501, 468, 342, 151, 48];

const trendOption: EChartsOption = {
  legend: { top: 10, right: 10, textStyle: { color: "#8aa0b7", fontSize: 11 }, data: ["实际功率", "预测功率"] },
  grid: baseGrid,
  xAxis: { type: "category", data: times, boundaryGap: false, ...axis },
  yAxis: { type: "value", name: "MW", nameTextStyle: { color: "#7890a8" }, splitLine: { lineStyle: { color: "rgba(184,203,224,.08)" } }, ...axis },
  series: [
    { name: "实际功率", type: "line", smooth: true, symbol: "none", data: power, lineStyle: { color: cyan, width: 3 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(20,184,212,.42)" }, { offset: 1, color: "rgba(20,184,212,0)" }] } } },
    { name: "预测功率", type: "line", smooth: true, symbol: "none", data: forecast, lineStyle: { color: gold, width: 2, type: "dashed" } },
  ],
};

const stationOption: EChartsOption = {
  grid: { left: 66, right: 18, top: 14, bottom: 20 },
  xAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(184,203,224,.07)" } }, ...axis },
  yAxis: { type: "category", data: ["山地四号", "沙漠五号", "草原三号", "滨海二号", "戈壁一号"], ...axis },
  series: [{ type: "bar", barWidth: 9, data: [198, 225, 241, 268, 312], itemStyle: { borderRadius: [0, 3, 3, 0], color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: blue }, { offset: 1, color: cyan }] } } }],
};

const radarOption: EChartsOption = {
  radar: { radius: "65%", indicator: [{ name: "逆变器", max: 100 }, { name: "并网柜", max: 100 }, { name: "组件", max: 100 }, { name: "储能", max: 100 }, { name: "通信", max: 100 }, { name: "环境", max: 100 }], axisName: { color: "#8aa0b7", fontSize: 10 }, splitLine: { lineStyle: { color: "rgba(20,184,212,.18)" } }, splitArea: { areaStyle: { color: ["rgba(18,53,91,.08)", "rgba(18,53,91,.18)"] } }, axisLine: { lineStyle: { color: "rgba(20,184,212,.18)" } } },
  series: [{ type: "radar", data: [{ value: [96, 94, 88, 91, 97, 89], name: "健康度", areaStyle: { color: "rgba(20,184,212,.3)" }, lineStyle: { color: cyan, width: 2 }, itemStyle: { color: gold } }] }],
};

const revenueOption: EChartsOption = {
  tooltip: { trigger: "item" },
  legend: { orient: "vertical", right: 8, top: "center", textStyle: { color: "#8aa0b7", fontSize: 10 } },
  series: [{ type: "pie", radius: ["48%", "70%"], center: ["36%", "52%"], label: { show: false }, data: [{ value: 46, name: "上网售电", itemStyle: { color: cyan } }, { value: 32, name: "绿证交易", itemStyle: { color: gold } }, { value: 22, name: "补贴收入", itemStyle: { color: blue } }] }],
};

function Chart({ option, height = 220 }: { option: EChartsOption; height?: number }) {
  return <ClientOnly fallback={<div className="chart-loading" />}>{<Suspense fallback={<div className="chart-loading" />}><SolarChart option={option} height={height} /></Suspense>}</ClientOnly>;
}

function GlassPanel({ title, subtitle, icon: Icon = Activity, children, className = "" }: { title: string; subtitle?: string; icon?: ComponentType<{ className?: string }>; children: React.ReactNode; className?: string }) {
  return (
    <section className={`glass-panel ${className}`}>
      <div className="panel-heading"><div><div className="panel-title"><Icon className="panel-icon" />{title}</div>{subtitle && <p>{subtitle}</p>}</div><span className="live-mark"><i /> LIVE</span></div>
      {children}
    </section>
  );
}

const metricMap: Record<SolarPage, Array<[string, string, string, string, ComponentType<{ className?: string }>]>> = {
  overview: [["今日发电量", "1,284", "MWh", "▲ 6.2% 同比", SunMedium], ["实时功率", "486", "MW", "峰值 512 MW", Zap], ["系统效率", "98.2", "%", "PR 值 82.4%", Gauge], ["今日收益", "86.4", "万元", "度电均价 0.67", CircleDollarSign], ["设备在线", "12,847", "台", "可用率 99.6%", Cpu], ["活跃告警", "7", "条", "严重 2 · 一般 5", TriangleAlert]],
  monitor: [["当前辐照度", "892", "W/m²", "光照条件优秀", SunMedium], ["并网功率", "478", "MW", "指令响应 99.8%", Zap], ["环境温度", "28.6", "°C", "组件温度 42.1°C", ThermometerSun], ["电网频率", "50.02", "Hz", "波动 ±0.03", Activity], ["通信在线", "99.94", "%", "延迟 36ms", RadioTower], ["储能荷电", "76.8", "%", "可用 148MWh", BatteryCharging]],
  analysis: [["本月发电", "38.6", "GWh", "完成计划 104%", BarChart3], ["等效小时", "126.4", "h", "同比 +8.1h", Gauge], ["弃光率", "1.18", "%", "低于目标 0.32%", SunMedium], ["综合PR", "82.4", "%", "行业领先", Activity], ["预测准确率", "96.7", "%", "提升 1.2%", Sparkles], ["碳减排", "31,892", "吨", "等效植树 174万棵", ShieldCheck]],
  devices: [["设备总数", "12,902", "台", "覆盖 5 座电站", Cpu], ["正常运行", "12,847", "台", "占比 99.57%", ShieldCheck], ["待机设备", "31", "台", "计划内待机", Activity], ["故障设备", "7", "台", "高优先级 2 台", TriangleAlert], ["平均效率", "96.4", "%", "逆变器集群", Gauge], ["今日工单", "18", "项", "已完成 11 项", Wrench]],
  maintenance: [["AI诊断事件", "26", "项", "自动闭环 19 项", Sparkles], ["预测性工单", "12", "项", "避免损失 42MWh", Wrench], ["平均响应", "8.4", "分钟", "较上月 -18%", Activity], ["计划完成率", "94.6", "%", "本周 52/55", ShieldCheck], ["无人机巡检", "328", "组串", "发现热斑 6 处", RadioTower], ["运维节省", "28.6", "万元", "本月累计", CircleDollarSign]],
  report: [["综合能效", "92.6", "分", "A级运营水平", Gauge], ["发电达成", "104.2", "%", "超计划 1.56GWh", SunMedium], ["度电成本", "0.184", "元", "同比下降 6.8%", CircleDollarSign], ["可利用率", "99.31", "%", "目标 99.00%", ShieldCheck], ["绿电收入", "2,648", "万元", "同比增长 12.4%", BarChart3], ["碳资产", "386", "万元", "可交易 3.2万吨", Sparkles]],
};

function Metrics({ page }: { page: SolarPage }) {
  return <section className="metric-grid">{metricMap[page].map(([label, value, unit, note, Icon], index) => <article className="metric-card" key={label} style={{ animationDelay: `${index * 45}ms` }}><div className="metric-label"><span>{label}</span><Icon /></div><div className={index % 3 === 1 ? "metric-value gold" : "metric-value"}>{value}<small>{unit}</small></div><p>{note}</p></article>)}</section>;
}

const deviceRows = [
  ["INV-G1-0102", "戈壁一号", "逆变器", "告警", "48.2", "88.1%", "62°C", "12:04:18"],
  ["INV-B2-0311", "滨海二号", "逆变器", "正常", "46.7", "96.4%", "41°C", "12:04:18"],
  ["STR-C3-0088", "草原三号", "储能柜", "正常", "32.5", "94.2%", "38°C", "12:04:15"],
  ["PCC-M4-0207", "山地四号", "并网柜", "离线", "—", "—", "—", "11:42:03"],
  ["INV-D5-0455", "沙漠五号", "逆变器", "正常", "44.9", "95.8%", "44°C", "12:04:16"],
];

function DeviceTable({ maintenance = false }: { maintenance?: boolean }) {
  const headers = maintenance ? ["工单编号", "电站", "任务类型", "优先级", "负责人", "进度", "截止时间", "状态"] : ["设备编号", "所属电站", "类型", "状态", "功率(kW)", "效率", "温度", "更新时间"];
  const rows = maintenance ? [["WO-260922-18", "戈壁一号", "逆变器过温复检", "紧急", "陈工", "80%", "14:30", "处理中"], ["WO-260922-17", "滨海二号", "并网柜电压校准", "高", "王工", "45%", "16:00", "处理中"], ["WO-260922-16", "草原三号", "无人机热斑复核", "中", "李工", "100%", "12:00", "已完成"], ["WO-260922-15", "山地四号", "通信模块更换", "高", "赵工", "20%", "17:30", "待备件"], ["WO-260922-14", "沙漠五号", "组件清洗", "低", "周工", "65%", "明日", "执行中"]] : deviceRows;
  return <div className="table-wrap"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={index === 0 ? "code-cell" : index === 3 || index === 7 ? "status-cell" : ""}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function Alerts({ mode = "alert" }: { mode?: "alert" | "station" | "task" }) {
  const items = mode === "station" ? [["戈壁一号", "312 MW", "运行优"], ["滨海二号", "268 MW", "运行优"], ["草原三号", "241 MW", "正常"], ["山地四号", "198 MW", "需关注"]] : mode === "task" ? [["逆变器过温复检", "80%", "紧急"], ["并网柜电压校准", "45%", "高"], ["无人机热斑复核", "100%", "完成"], ["通信模块更换", "20%", "待备件"]] : [["戈壁一号 逆变器 A-102 过温", "2分钟前", "严重"], ["滨海二号 并网柜电压越限", "8分钟前", "严重"], ["草原三号 组件灰尘遮挡", "16分钟前", "一般"], ["山地四号 通信信号偏弱", "21分钟前", "一般"]];
  return <div className="status-list">{items.map(([name, detail, state], index) => <div className="status-row" key={name}><i className={index < 2 ? "warn" : ""} /><span>{name}</span><small>{detail}</small><b>{state}</b></div>)}</div>;
}

function Overview() { return <><div className="wide-split"><GlassPanel title="今日功率趋势" subtitle="全站点实时出力 · MW / 24H" icon={Activity}><Chart option={trendOption} height={260} /></GlassPanel><GlassPanel title="设备健康雷达" subtitle="六维综合评估" icon={ShieldCheck}><Chart option={radarOption} height={260} /></GlassPanel></div><div className="triple-grid"><GlassPanel title="各电站发电量" icon={BarChart3}><Chart option={stationOption} height={220} /></GlassPanel><GlassPanel title="收益构成" icon={CircleDollarSign}><Chart option={revenueOption} height={220} /></GlassPanel><GlassPanel title="实时告警" icon={TriangleAlert}><Alerts /></GlassPanel></div><GlassPanel title="设备数据表格" subtitle="12,847 台在线 · 每 5 秒刷新" icon={Cpu}><DeviceTable /></GlassPanel></>; }

function Monitor() {
  const voltage: EChartsOption = { legend: { top: 10, right: 10, textStyle: { color: "#8aa0b7" }, data: ["A相", "B相", "C相"] }, grid: baseGrid, xAxis: { type: "category", data: times, ...axis }, yAxis: { type: "value", min: 215, max: 245, splitLine: { lineStyle: { color: "rgba(184,203,224,.08)" } }, ...axis }, series: [
    { name: "A相", type: "line", smooth: true, symbol: "none", lineStyle: { color: cyan, width: 2 }, data: power.map((v, n) => 226 + ((v + n * 2) % 12)) },
    { name: "B相", type: "line", smooth: true, symbol: "none", lineStyle: { color: gold, width: 2 }, data: power.map((v, n) => 226 + ((v + n * 3) % 12)) },
    { name: "C相", type: "line", smooth: true, symbol: "none", lineStyle: { color: green, width: 2 }, data: power.map((v, n) => 226 + ((v + n * 4) % 12)) },
  ] };
  return <><div className="monitor-grid"><GlassPanel title="全场实时运行曲线" subtitle="三相并网电压 · V" icon={RadioTower}><Chart option={voltage} height={290} /></GlassPanel><GlassPanel title="电站实时状态" icon={Activity}><Alerts mode="station" /></GlassPanel></div><div className="quad-grid"><GlassPanel title="储能荷电状态" icon={BatteryCharging}><div className="energy-orbit"><strong>76.8<small>%</small></strong><span>148 MWh 可用</span></div></GlassPanel><GlassPanel title="气象站监测" icon={ThermometerSun}><div className="sensor-stack"><span>辐照度 <b>892 W/m²</b></span><span>环境温度 <b>28.6°C</b></span><span>风速 <b>3.2 m/s</b></span><span>湿度 <b>42%</b></span></div></GlassPanel><GlassPanel title="通信质量" icon={RadioTower}><div className="signal-bars"><i/><i/><i/><i/><i/></div><p className="center-note">99.94% 在线 · 36ms 延迟</p></GlassPanel><GlassPanel title="并网安全" icon={ShieldCheck}><div className="shield-score"><ShieldCheck/><strong>稳定</strong><span>50.02 Hz</span></div></GlassPanel></div><GlassPanel title="实时测点数据" icon={Cpu}><DeviceTable /></GlassPanel></>;
}

function Analysis() {
  const monthly: EChartsOption = { legend: { top: 10, right: 10, textStyle: { color: "#8aa0b7" }, data: ["实际发电", "计划发电"] }, grid: baseGrid, xAxis: { type: "category", data: ["4月", "5月", "6月", "7月", "8月", "9月"], ...axis }, yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(184,203,224,.08)" } }, ...axis }, series: [{ name: "实际发电", type: "bar", data: [31, 34, 36, 40, 42, 38.6], itemStyle: { color: cyan, borderRadius: [3, 3, 0, 0] } }, { name: "计划发电", type: "line", smooth: true, data: [30, 33, 35, 38, 40, 37], lineStyle: { color: gold, width: 3 } }] };
  return <><div className="analysis-grid"><GlassPanel title="月度发电达成分析" subtitle="实际发电与计划基线 · GWh" icon={BarChart3}><Chart option={monthly} height={300} /></GlassPanel><GlassPanel title="损耗结构" icon={SunMedium}><Chart option={{ ...revenueOption, series: [{ type: "pie", radius: ["40%", "68%"], label: { color: "#8aa0b7", fontSize: 10 }, data: [{ value: 42, name: "温度损耗", itemStyle: { color: gold } }, { value: 24, name: "灰尘遮挡", itemStyle: { color: cyan } }, { value: 19, name: "线损", itemStyle: { color: blue } }, { value: 15, name: "其他", itemStyle: { color: danger } }] }] }} height={300} /></GlassPanel></div><div className="wide-split reverse"><GlassPanel title="典型日功率对比" icon={Activity}><Chart option={trendOption} height={250} /></GlassPanel><GlassPanel title="运营能力雷达" icon={Gauge}><Chart option={radarOption} height={250} /></GlassPanel></div><GlassPanel title="电站发电绩效排名" icon={FileChartColumn}><DeviceTable /></GlassPanel></>;
}

function Devices() { return <><div className="device-layout"><GlassPanel title="设备集群健康分布" subtitle="按设备类型聚合" icon={Cpu}><Chart option={radarOption} height={300} /></GlassPanel><GlassPanel title="故障类型统计" icon={TriangleAlert}><Chart option={stationOption} height={300} /></GlassPanel><GlassPanel title="重点设备状态" icon={Activity}><Alerts mode="station" /></GlassPanel></div><GlassPanel title="全量设备台账" subtitle="支持按设备类型、状态与电站筛选" icon={Cpu}><DeviceTable /></GlassPanel><div className="triple-grid"><GlassPanel title="逆变器效率" icon={Gauge}><div className="big-stat">96.4<small>%</small><span>集群平均</span></div></GlassPanel><GlassPanel title="组件衰减率" icon={SunMedium}><div className="big-stat gold">0.42<small>%</small><span>年度衰减</span></div></GlassPanel><GlassPanel title="储能循环次数" icon={BatteryCharging}><div className="big-stat">1,286<small>次</small><span>平均健康度 93%</span></div></GlassPanel></div></>; }

function Maintenance() { return <><div className="maintenance-lead"><GlassPanel title="AI 智能诊断中心" subtitle="风险事件影响与建议优先级" icon={Sparkles}><div className="diagnosis"><div><Sparkles/><strong>发现 6 项潜在风险</strong><p>预计可避免 42 MWh 发电损失</p></div><div className="risk-score">风险指数<strong>28</strong><span>低风险</span></div></div></GlassPanel><GlassPanel title="工单执行状态" icon={Wrench}><Alerts mode="task" /></GlassPanel></div><div className="wide-split"><GlassPanel title="故障预测趋势" icon={Activity}><Chart option={trendOption} height={250} /></GlassPanel><GlassPanel title="维护资源负载" icon={BarChart3}><Chart option={stationOption} height={250} /></GlassPanel></div><GlassPanel title="智能运维工单" subtitle="AI 推荐顺序 · 实时同步" icon={Wrench}><DeviceTable maintenance /></GlassPanel></>; }

function Report() {
  const scoreOption: EChartsOption = { series: [{ type: "gauge", startAngle: 210, endAngle: -30, min: 0, max: 100, splitNumber: 5, progress: { show: true, width: 16, itemStyle: { color: cyan } }, axisLine: { lineStyle: { width: 16, color: [[1, "rgba(184,203,224,.12)"]] } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { color: "#7890a8", distance: 24 }, pointer: { itemStyle: { color: gold } }, detail: { valueAnimation: true, formatter: "{value}分", color: "#eaf7ff", fontSize: 24, offsetCenter: [0, "65%"] }, data: [{ value: 92.6 }] }] };
  return <><div className="report-hero"><GlassPanel title="九月综合能效评分" subtitle="2026.09.01 — 2026.09.22" icon={FileChartColumn}><Chart option={scoreOption} height={310} /></GlassPanel><GlassPanel title="六维绩效评估" icon={Gauge}><Chart option={radarOption} height={310} /></GlassPanel><GlassPanel title="收益与碳资产" icon={CircleDollarSign}><Chart option={revenueOption} height={310} /></GlassPanel></div><div className="analysis-grid"><GlassPanel title="年度发电趋势" icon={BarChart3}><Chart option={trendOption} height={270} /></GlassPanel><GlassPanel title="各站能效排名" icon={ShieldCheck}><Chart option={stationOption} height={270} /></GlassPanel></div><GlassPanel title="月度关键绩效明细" icon={FileChartColumn}><DeviceTable /></GlassPanel></>;
}

const content: Record<SolarPage, () => React.JSX.Element> = { overview: Overview, monitor: Monitor, analysis: Analysis, devices: Devices, maintenance: Maintenance, report: Report };

export function SolarPlatform({ page }: { page: SolarPage }) {
  const Content = content[page];
  return (
    <div className="solar-app">
      <img src={solarBackground} alt="暮色中的大型智慧光伏电站" className="solar-bg" width={1920} height={1080} />
      <div className="solar-overlay" />
      <header className="top-nav">
        <div className="nav-inner">
          <nav className="nav-side">{pages.slice(0, 3).map((item) => <NavItem item={item} active={page === item.key} key={item.key} />)}</nav>
          <div className="brand-title"><SunMedium /><div><strong>智慧光伏综合运营平台</strong><span>SOLAR OPS COMMAND</span></div></div>
          <nav className="nav-side nav-right">{pages.slice(3).map((item) => <NavItem item={item} active={page === item.key} key={item.key} />)}</nav>
        </div>
      </header>
      <main className="platform-main">
        <div className="page-strip"><div><span>国家级新能源数字运营中心</span><strong>{pages.find((p) => p.key === page)?.label}</strong></div><div className="system-time"><i />系统运行正常 <b>2026-09-22 10:35:26</b></div></div>
        <Metrics page={page} />
        <div className="page-content"><Content /></div>
      </main>
    </div>
  );
}

function NavItem({ item, active }: { item: (typeof pages)[number]; active: boolean }) {
  const Icon = item.icon;
  return <Link to={item.path} className={`nav-item ${active ? "active" : ""}`}><Icon /><span>{item.label}</span></Link>;
}