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
		<div className="rounded-xl bg-[#1D1E17] px-3 py-1.5 text-[11px] font-medium text-[#F5F4EC] shadow-lg">
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
			<h3 className="text-[14px] font-medium text-[#1D1E17]">
				{commodity} — price trend
			</h3>

			{data.length === 0 ? (
				<p className="mt-6 text-center text-[13px] text-[#8A8A7C]">
					Not enough data yet to chart a trend.
				</p>
			) : (
				<div className="mt-4 h-48 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
							<XAxis
								dataKey="priceDate"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 10, fill: "#9C9B8C" }}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 10, fill: "#9C9B8C" }}
								width={40}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Line
								type="monotone"
								dataKey="modalPrice"
								stroke="#6F8A3F"
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4, fill: "#D6FF4D", stroke: "#1D1E17" }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}