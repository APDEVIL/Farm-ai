"use client";

import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { AdvisoryBadge } from "./advisory-badge";
import { X, Check, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdvisoryItem {
	_id: Id<"advisories">;
	title: string;
	body: string;
	severity: "info" | "warning" | "critical";
	cropName?: string;
	region?: string;
	source: "admin" | "system";
	validFrom: number;
	validUntil?: number;
}

interface AdvisoryListProps {
	advisories: AdvisoryItem[];
	/** Pass true when rendering the "unread" feed — shows mark-read/dismiss
	 * actions. Omit for read-only contexts like an admin review list. */
	interactive?: boolean;
	className?: string;
}

export function AdvisoryList({
	advisories,
	interactive = true,
	className,
}: AdvisoryListProps) {
	const markRead = useMutation(api.advisory.mutations.markRead);
	const dismiss = useMutation(api.advisory.mutations.dismiss);

	async function handleMarkRead(advisoryId: Id<"advisories">) {
		try {
			await markRead({ advisoryId });
		} catch (err) {
			toast.error("Couldn't mark as read");
		}
	}

	async function handleDismiss(advisoryId: Id<"advisories">) {
		try {
			await dismiss({ advisoryId });
			toast.success("Advisory dismissed");
		} catch (err) {
			toast.error("Couldn't dismiss advisory");
		}
	}

	if (advisories.length === 0) {
		return (
			<div className="rounded-3xl border border-black/5 bg-white/70 p-8 text-center">
				<CloudSun className="mx-auto h-6 w-6 text-[#B7B6A8]" strokeWidth={1.5} />
				<p className="mt-2 text-[13px] text-[#8A8A7C]">
					No advisories right now — you're all caught up.
				</p>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			{advisories.map((a) => (
				<div
					key={a._id}
					className="rounded-3xl border border-black/5 bg-white/70 p-5 backdrop-blur-sm"
				>
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-2">
								<AdvisoryBadge severity={a.severity} />
								{a.cropName && (
									<span className="text-[11px] text-[#8A8A7C]">
										{a.cropName}
									</span>
								)}
								{a.region && (
									<span className="text-[11px] text-[#8A8A7C]">
										• {a.region}
									</span>
								)}
							</div>
							<h3 className="mt-2 text-[14px] font-semibold text-[#1D1E17]">
								{a.title}
							</h3>
							<p className="mt-1 text-[13px] leading-relaxed text-[#4C4C42]">
								{a.body}
							</p>
						</div>

						{interactive && (
							<div className="flex shrink-0 gap-2">
								<button
									type="button"
									onClick={() => handleMarkRead(a._id)}
									className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFEEE4] text-[#4C4C42] transition hover:bg-[#D6FF4D] hover:text-[#1B1D14]"
									aria-label="Mark as read"
								>
									<Check className="h-3.5 w-3.5" strokeWidth={2} />
								</button>
								<button
									type="button"
									onClick={() => handleDismiss(a._id)}
									className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFEEE4] text-[#4C4C42] transition hover:bg-[#F3B8B8] hover:text-[#7A1F1F]"
									aria-label="Dismiss"
								>
									<X className="h-3.5 w-3.5" strokeWidth={2} />
								</button>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}