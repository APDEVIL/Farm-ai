"use client";

import { useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { AppTopbar } from "@/components/layout/app-topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { OptimalZoneCard } from "@/components/dashboard/optimal-zone-card";
import { NpkLevelsCard } from "@/components/dashboard/npk-levels-card";
import { LeafAreaChart } from "@/components/dashboard/leaf-area-chart";
import { SoilMoistureChart } from "@/components/dashboard/soil-moisture-chart";
import { AssistantPanel } from "@/components/dashboard/assistant-panel";
import { AdvisoryTipCard } from "@/components/dashboard/advisory-tip-card";
import { Sprout, Droplets, Gauge } from "lucide-react";

// ---------------------------------------------------------------------
// PLACEHOLDER DATA — NDVI, soil moisture, NPK, and leaf area index all
// require sensor/IoT hardware feeding real readings, which isn't part of
// the schema yet (confirmed with the client — using demo data for now).
// Swap these for real `useQuery` calls once a sensors table + ingestion
// pipeline exists. Everything else on this page (crop count, advisory
// tip) IS wired to real Convex data below.
// ---------------------------------------------------------------------
const DEMO_NDVI = "0.62";
const DEMO_HUMIDITY = "19%";
const DEMO_NPK = [
	{ name: "Nitrogen", value: 48 },
	{ name: "Phosphorus", value: 40 },
	{ name: "Potassium", value: 55 },
];
const DEMO_LEAF_AREA = [
	{ label: "Week 01", value: -0.7, percent: 55 },
	{ label: "This Week", value: -2.2, percent: 75 },
	{ label: "Week 02", value: -1.4, percent: 40 },
];
const DEMO_MOISTURE_24H = [
	{ label: "6am", value: 42 },
	{ label: "9am", value: 51 },
	{ label: "12pm", value: 68 },
	{ label: "3pm", value: 60 },
	{ label: "6pm", value: 55 },
	{ label: "9pm", value: 47 },
];
const DEMO_MOISTURE_48H = [
	{ label: "Day 1", value: 44 },
	{ label: "Day 1.5", value: 58 },
	{ label: "Day 2", value: 68 },
	{ label: "Day 2.5", value: 52 },
];

export default function DashboardPage() {
	const crops = useQuery(api.crops.queries.listMyCrops);
	const unreadAdvisories = useQuery(api.advisory.queries.listUnread);

	const plannedOrGrowing =
		crops?.filter((c) => c.status !== "harvested") ?? [];
	const totalAcres = plannedOrGrowing.reduce(
		(sum, c) => sum + (c.areaAcres ?? 0),
		0,
	);

	const topAdvisory = unreadAdvisories?.[0];

	return (
		<div className="flex flex-col gap-6 pb-24">
			<AppTopbar
				title="Dashboard"
				subtitle="Demo sensor data shown below — connect a soil/weather feed to replace it"
				rightSlot={
					<div className="flex gap-2">
						<StatCard
							icon={Droplets}
							label="Soil Watering"
							value="12h"
							className="hidden sm:flex"
						/>
					</div>
				}
			/>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<StatCard
					icon={Sprout}
					label="Planted area"
					value={
						crops === undefined ? "..." : `${totalAcres.toFixed(1)}ac`
					}
				/>
				<StatCard icon={Gauge} label="Current NDVI" value={DEMO_NDVI} />
				<StatCard icon={Droplets} label="Humidity" value={DEMO_HUMIDITY} />
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<OptimalZoneCard
					percentage={64}
					crops={[
						{ name: "Corn", quantity: "375t", emoji: "🌽" },
						{ name: "Potato", quantity: "750t", emoji: "🥔" },
						{ name: "Carrot", quantity: "1,000t", emoji: "🥕" },
					]}
					onAddCrop={() => toast.info("Head to the Crops page to add one")}
					className="lg:col-span-2"
				/>
				<LeafAreaChart weeks={DEMO_LEAF_AREA} />
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<NpkLevelsCard nutrients={DEMO_NPK} className="lg:col-span-1" />
				<SoilMoistureChart
					data24h={DEMO_MOISTURE_24H}
					data48h={DEMO_MOISTURE_48H}
					className="lg:col-span-2"
				/>
			</div>

			{topAdvisory && (
				<AdvisoryTipCard
					imageUrl="/images/advisory-farmer-placeholder.jpg"
					message={topAdvisory.body}
					onCtaClick={() => (window.location.href = "/advisory")}
				/>
			)}

			<AssistantPanel />
		</div>
	);
}