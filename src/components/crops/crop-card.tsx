"use client";

import { useMutation } from "convex/react";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface CropItem {
	_id: Id<"crops">;
	name: string;
	variety?: string;
	areaAcres?: number;
	status: "planned" | "growing" | "harvested";
	sownDate?: number;
	expectedHarvestDate?: number;
}

const STATUS_STYLE: Record<CropItem["status"], string> = {
	planned: "bg-[#EAF1FB] text-[#2E5C99]",
	growing: "bg-[#EEF6DD] text-[#5C7A2E]",
	harvested: "bg-[#EFEEE4] text-[#6B6B62]",
};

function formatDate(ms?: number) {
	if (!ms) return null;
	return new Date(ms).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
	});
}

interface CropCardProps {
	crop: CropItem;
	onEdit?: (crop: CropItem) => void;
	className?: string;
}

export function CropCard({ crop, onEdit, className }: CropCardProps) {
	const updateStatus = useMutation(api.crops.mutations.updateCropStatus);
	const deleteCrop = useMutation(api.crops.mutations.deleteCrop);

	async function handleStatusChange(status: CropItem["status"]) {
		try {
			await updateStatus({ cropId: crop._id, status });
			toast.success(`Marked as ${status}`);
		} catch {
			toast.error("Couldn't update status");
		}
	}

	async function handleDelete() {
		try {
			await deleteCrop({ cropId: crop._id });
			toast.success("Crop removed");
		} catch {
			toast.error("Couldn't delete crop");
		}
	}

	return (
		<div
			className={cn(
				"rounded-3xl border border-black/5 bg-white/70 p-5 backdrop-blur-sm",
				className,
			)}
		>
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-[15px] font-semibold text-[#1D1E17]">{crop.name}</h3>
					{crop.variety && (
						<p className="text-[12px] text-[#8A8A7C]">{crop.variety}</p>
					)}
				</div>

				{/* FIXED: Removed the <div> wrapper entirely */}
				<DropdownMenu>
					<DropdownMenuTrigger
						aria-label="Crop actions"
						className="flex h-7 w-7 items-center justify-center rounded-full text-[#8A8A7C] outline-none transition hover:bg-black/5 focus:ring-2 focus:ring-black/10"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
					>
						<MoreVertical className="h-4 w-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onEdit?.(crop)}>
							<Pencil className="mr-2 h-3.5 w-3.5" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleStatusChange("planned")}>
							Mark as Planned
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleStatusChange("growing")}>
							Mark as Growing
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleStatusChange("harvested")}>
							Mark as Harvested
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600 focus:text-red-600"
							onClick={handleDelete}
						>
							<Trash2 className="mr-2 h-3.5 w-3.5" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="mt-4 flex flex-wrap items-center gap-2">
				<span
					className={cn(
						"rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
						STATUS_STYLE[crop.status],
					)}
				>
					{crop.status}
				</span>
				{crop.areaAcres != null && (
					<span className="text-[12px] text-[#8A8A7C]">
						{crop.areaAcres} acres
					</span>
				)}
			</div>

			{(crop.sownDate || crop.expectedHarvestDate) && (
				<div className="mt-3 flex gap-4 border-t border-black/5 pt-3 text-[11px] text-[#8A8A7C]">
					{crop.sownDate && <span>Sown: {formatDate(crop.sownDate)}</span>}
					{crop.expectedHarvestDate && (
						<span>Harvest: {formatDate(crop.expectedHarvestDate)}</span>
					)}
				</div>
			)}
		</div>
	);
}