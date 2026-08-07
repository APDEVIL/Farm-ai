"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { CropItem } from "./crop-card";

interface CropFormProps {
	/** Pass an existing crop to edit it; omit to add a new one. */
	crop?: CropItem;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

function toDateInputValue(ms?: number) {
	if (!ms) return "";
	return new Date(ms).toISOString().slice(0, 10);
}

function fromDateInputValue(value: string): number | undefined {
	if (!value) return undefined;
	return new Date(value).getTime();
}

export function CropForm({ crop, trigger, open, onOpenChange }: CropFormProps) {
	const isEdit = !!crop;
	const addCrop = useMutation(api.crops.mutations.addCrop);
	const updateCrop = useMutation(api.crops.mutations.updateCrop);

	const [name, setName] = useState(crop?.name ?? "");
	const [variety, setVariety] = useState(crop?.variety ?? "");
	const [areaAcres, setAreaAcres] = useState(
		crop?.areaAcres != null ? String(crop.areaAcres) : "",
	);
	const [sownDate, setSownDate] = useState(toDateInputValue(crop?.sownDate));
	const [harvestDate, setHarvestDate] = useState(
		toDateInputValue(crop?.expectedHarvestDate),
	);
	const [submitting, setSubmitting] = useState(false);

	// Keep form fields in sync if a different crop is passed in for editing
	useEffect(() => {
		setName(crop?.name ?? "");
		setVariety(crop?.variety ?? "");
		setAreaAcres(crop?.areaAcres != null ? String(crop.areaAcres) : "");
		setSownDate(toDateInputValue(crop?.sownDate));
		setHarvestDate(toDateInputValue(crop?.expectedHarvestDate));
	}, [crop]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Crop name is required");
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				name: name.trim(),
				variety: variety.trim() || undefined,
				areaAcres: areaAcres ? Number(areaAcres) : undefined,
				sownDate: fromDateInputValue(sownDate),
				expectedHarvestDate: fromDateInputValue(harvestDate),
			};

			if (isEdit && crop) {
				await updateCrop({ cropId: crop._id as Id<"crops">, ...payload });
				toast.success("Crop updated");
			} else {
				await addCrop(payload);
				toast.success("Crop added");
			}
			onOpenChange?.(false);
		} catch {
			toast.error(isEdit ? "Couldn't update crop" : "Couldn't add crop");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger !== undefined ? (
				<DialogTrigger render={trigger as React.ReactElement} />
			) : (
				<DialogTrigger className="flex items-center gap-1.5 rounded-full bg-[#D6FF4D] px-4 py-2 font-semibold text-[#1B1D14] text-[12px] transition hover:bg-[#c7f02f]">
					<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
					Add Crop
				</DialogTrigger>
			)}

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit crop" : "Add a new crop"}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<Label htmlFor="crop-name">Crop name</Label>
						<Input
							id="crop-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Wheat"
							required
						/>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="crop-variety">Variety (optional)</Label>
						<Input
							id="crop-variety"
							value={variety}
							onChange={(e) => setVariety(e.target.value)}
							placeholder="e.g. HD-2967"
						/>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="crop-area">Area (acres)</Label>
						<Input
							id="crop-area"
							type="number"
							min="0"
							step="0.1"
							value={areaAcres}
							onChange={(e) => setAreaAcres(e.target.value)}
							placeholder="e.g. 2.5"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="crop-sown">Sown date</Label>
							<Input
								id="crop-sown"
								type="date"
								value={sownDate}
								onChange={(e) => setSownDate(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="crop-harvest">Expected harvest</Label>
							<Input
								id="crop-harvest"
								type="date"
								value={harvestDate}
								onChange={(e) => setHarvestDate(e.target.value)}
							/>
						</div>
					</div>

					<DialogFooter>
						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-full bg-[#D6FF4D] px-4 py-2.5 text-[13px] font-semibold text-[#1B1D14] transition hover:bg-[#c7f02f] disabled:opacity-60"
						>
							{submitting ? "Saving..." : isEdit ? "Save changes" : "Add crop"}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}