"use client";

import { useState } from "react";
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface MoisturePoint {
	label: string; // x-axis tick, e.g. time or stage label
	value: number;
}

interface SoilMoistureChartProps {
	data24h: MoisturePoint[];
	data48h: MoisturePoint[];
	className?: string;
}

const RANGES = ["24 hours", "48 hours"] as const;

function CustomTooltip({ active, payload }: any) {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-xl bg-[#1D1E17] px-3 py-1.5 text-[11px] font-medium text-[#F5F4EC] shadow-lg">
			High level {payload[0].value}
		</div>
	);
}

export function SoilMoistureChart({
	data24h,
	data48h,
	className,
}: SoilMoistureChartProps) {
	const [range, setRange] = useState<(typeof RANGES)[number]>("24 hours");
	const data = range === "24 hours" ? data24h : data48h;

	return (
		<div
			className={cn(
				"rounded-3xl border border-black/5 bg-white/70 p-5 backdrop-blur-sm",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<h3 className="text-[14px] font-medium text-[#1D1E17]">Soil Moisture</h3>
				<div className="flex rounded-full bg-[#EFEEE4] p-1">
					{RANGES.map((r) => (
						<button
							key={r}
							type="button"
							onClick={() => setRange(r)}
							className={cn(
								"rounded-full px-3 py-1 text-[11px] font-medium transition",
								range === r
									? "bg-[#D6FF4D] text-[#1B1D14]"
									: "text-[#8A8A7C] hover:text-[#1D1E17]",
							)}
						>
							{r}
						</button>
					))}
				</div>
			</div>

			<div className="mt-2 h-40 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={data} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
						<defs>
							<linearGradient id="moistureFill" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#8FA857" stopOpacity={0.35} />
								<stop offset="100%" stopColor="#8FA857" stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="label"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 11, fill: "#9C9B8C" }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Area
							type="monotone"
							dataKey="value"
							stroke="#6F8A3F"
							strokeWidth={2}
							fill="url(#moistureFill)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}