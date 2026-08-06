import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
	icon: LucideIcon;
	label: string;
	value: string;
	className?: string;
}

/** Compact pill-shaped stat, e.g. "Planted area — 125ha". Matches the
 * small rounded cards along the top of the reference dashboard. */
export function StatCard({ icon: Icon, label, value, className }: StatCardProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-3 backdrop-blur-sm",
				className,
			)}
		>
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF3DE]">
				<Icon className="h-4 w-4 text-[#3F4A2B]" strokeWidth={1.75} />
			</div>
			<div className="flex flex-col leading-tight">
				<span className="text-[13px] text-[#6B6B62]">{label}</span>
				<span className="text-[15px] font-semibold text-[#1D1E17]">{value}</span>
			</div>
		</div>
	);
}