"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AdvisoryList } from "@/components/advisory/advisory-list";
import { cn } from "@/lib/utils";

const TABS = ["Unread", "All active"] as const;

export default function AdvisoryPage() {
	const [tab, setTab] = useState<(typeof TABS)[number]>("Unread");

	const unread = useQuery(api.advisory.queries.listUnread);
	const active = useQuery(api.advisory.queries.listActiveAdvisories);

	const advisories = tab === "Unread" ? unread : active;

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				rightSlot={
					<div className="flex rounded-full bg-[#EFEEE4] p-1">
						{TABS.map((t) => (
							<button
								key={t}
								className={cn(
									"rounded-full px-3 py-1.5 text-[12px] font-medium transition",
									tab === t
										? "bg-[#D6FF4D] text-[#1B1D14]"
										: "text-[#8A8A7C] hover:text-[#1D1E17]",
								)}
								onClick={() => setTab(t)}
								type="button"
							>
								{t}
							</button>
						))}
					</div>
				}
				subtitle="Weather alerts and recommendations for your crops"
				title="Advisory"
			/>

			{advisories === undefined ? (
				<div className="flex flex-col gap-3">
					{[1, 2, 3].map((skeletonId) => (
						<div
							key={skeletonId}
							className="h-24 animate-pulse rounded-3xl bg-white/50"
						/>
					))}
				</div>
			) : (
				<AdvisoryList
					advisories={advisories}
					interactive={tab === "Unread"}
				/>
			)}
		</div>
	);
}