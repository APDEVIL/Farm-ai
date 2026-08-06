import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeafAreaWeek {
	label: string;
	value: number; // signed index value shown in the ring, e.g. -0.7
	percent: number; // 0-100, how full the ring is drawn
}

interface LeafAreaChartProps {
	weeks: LeafAreaWeek[];
	className?: string;
}

function Ring({ percent, value }: { percent: number; value: number }) {
	const size = 96;
	const stroke = 6;
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference * (1 - percent / 100);

	return (
		<svg width={size} height={size} className="shrink-0">
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={stroke}
				className="fill-none stroke-white/10"
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={stroke}
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
				className="fill-none stroke-[#D6FF4D] transition-[stroke-dashoffset] duration-500"
			/>
			<text
				x="50%"
				y="50%"
				textAnchor="middle"
				dominantBaseline="middle"
				className="fill-[#F5F4EC] text-[15px] font-semibold"
			>
				{value}
			</text>
		</svg>
	);
}

/** Dark card visualizing leaf area index across three time windows as
 * overlapping radial rings — the "signature" chart of this dashboard. */
export function LeafAreaChart({ weeks, className }: LeafAreaChartProps) {
	return (
		<div className={cn("rounded-3xl bg-[#20231A] p-5", className)}>
			<div className="flex items-center justify-between">
				<h3 className="text-[14px] font-medium text-[#E7E6D9]">Leaf area index</h3>
				<button
					type="button"
					className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#E7E6D9] transition hover:bg-white/20"
					aria-label="Expand leaf area index"
				>
					<ArrowUpRight className="h-3.5 w-3.5" />
				</button>
			</div>

			<div className="mt-4 flex items-center justify-center">
				{weeks.map((w, i) => (
					<div
						key={w.label}
						className="relative"
						style={{ marginLeft: i === 0 ? 0 : -24 }}
					>
						<Ring percent={w.percent} value={w.value} />
					</div>
				))}
			</div>

			<div className="mt-3 flex justify-center gap-6">
				{weeks.map((w) => (
					<span key={w.label} className="text-[11px] text-[#9C9B8C]">
						{w.label}
					</span>
				))}
			</div>
		</div>
	);
}