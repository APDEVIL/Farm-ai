"use client";

import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export interface PriceHistoryPoint {
	priceDate: string; // "YYYY-MM-DD"
	modalPrice: number;
}

interface PriceHistoryChartProps {
	commodity: string;
	data: PriceHistoryPoint[];
	className?: string;
}

function CustomTooltip({ active, payload, label }: any) {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-xl bg-[#1D1E17] px-3 py-1.5 font-medium text-[#F5F4EC] text-[11px] shadow-lg">
			{label}: ₹{payload[0].value.toLocaleString("en-IN")}
		</div>
	);
}

/** Modal price trend line for one commodity — pass data from
 * `useQuery(api.market.queries.getPriceHistory, { commodity, fromDate, toDate })`. */
export function PriceHistoryChart({
	commodity,
	data,
	className,
}: PriceHistoryChartProps) {
	return (
		<div
			className={cn(
				"rounded-3xl border border-black/5 bg-white/70 p-5 backdrop-blur-sm",
				className,
			)}
		>
			<h3 className="font-medium text-[#1D1E17] text-[14px]">
				{commodity} — price trend
			</h3>

			{data.length === 0 ? (
				<p className="mt-6 text-center text-[#8A8A7C] text-[13px]">
					Not enough data yet to chart a trend.
				</p>
			) : (
				<div className="mt-4 h-48 w-full">
					<ResponsiveContainer height="100%" width="100%">
						<LineChart
							data={data}
							margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
						>
							<XAxis
								axisLine={false}
								dataKey="priceDate"
								tick={{ fontSize: 10, fill: "#9C9B8C" }}
								tickLine={false}
							/>
							<YAxis
								axisLine={false}
								tick={{ fontSize: 10, fill: "#9C9B8C" }}
								tickLine={false}
								width={40}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Line
								activeDot={{ r: 4, fill: "#D6FF4D", stroke: "#1D1E17" }}
								dataKey="modalPrice"
								dot={false}
								stroke="#6F8A3F"
								strokeWidth={2}
								type="monotone"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}
