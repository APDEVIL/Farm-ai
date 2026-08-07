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
		<svg className="shrink-0" height={size} width={size}>
			<circle
				className="fill-none stroke-white/10"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={stroke}
			/>
			<circle
				className="fill-none stroke-[#D6FF4D] transition-[stroke-dashoffset] duration-500"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				strokeWidth={stroke}
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
			/>
			<text
				className="fill-[#F5F4EC] font-semibold text-[15px]"
				dominantBaseline="middle"
				textAnchor="middle"
				x="50%"
				y="50%"
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
				<h3 className="font-medium text-[#E7E6D9] text-[14px]">
					Leaf area index
				</h3>
				<button
					aria-label="Expand leaf area index"
					className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#E7E6D9] transition hover:bg-white/20"
					type="button"
				>
					<ArrowUpRight className="h-3.5 w-3.5" />
				</button>
			</div>

			<div className="mt-4 flex items-center justify-center">
				{weeks.map((w, i) => (
					<div
						className="relative"
						key={w.label}
						style={{ marginLeft: i === 0 ? 0 : -24 }}
					>
						<Ring percent={w.percent} value={w.value} />
					</div>
				))}
			</div>

			<div className="mt-3 flex justify-center gap-6">
				{weeks.map((w) => (
					<span className="text-[#9C9B8C] text-[11px]" key={w.label}>
						{w.label}
					</span>
				))}
			</div>
		</div>
	);
}
