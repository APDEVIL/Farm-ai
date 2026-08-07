"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Nutrient {
	name: string;
	value: number; // 0-100
}

interface NpkLevelsCardProps {
	nutrients: Nutrient[];
	className?: string;
}

const TABS = ["Analysis", "Record"] as const;

export function NpkLevelsCard({ nutrients, className }: NpkLevelsCardProps) {
	const [tab, setTab] = useState<(typeof TABS)[number]>("Analysis");

	return (
		<div
			className={cn(
				"rounded-3xl border border-black/5 bg-white/70 p-5 backdrop-blur-sm",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-[#1D1E17] text-[15px]">
						NPK Levels
					</h3>
					<p className="text-[#8A8A7C] text-[12px]">This week</p>
				</div>
				<div className="flex rounded-full bg-[#EFEEE4] p-1">
					{TABS.map((t) => (
						<button
							className={cn(
								"rounded-full px-3 py-1 font-medium text-[11px] transition",
								tab === t
									? "bg-[#D6FF4D] text-[#1B1D14]"
									: "text-[#8A8A7C] hover:text-[#1D1E17]",
							)}
							key={t}
							onClick={() => setTab(t)}
							type="button"
						>
							{t}
						</button>
					))}
				</div>
			</div>

			<div className="mt-5 space-y-4">
				{nutrients.map((n) => (
					<div key={n.name}>
						<div className="mb-1.5 flex items-center justify-between text-[12px]">
							<span className="text-[#4C4C42]">{n.name}</span>
							<span className="font-medium text-[#1D1E17]">{n.value}/100</span>
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-[#EFEEE4]">
							<div
								className="h-full rounded-full bg-[#8FA857]"
								style={{ width: `${n.value}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
