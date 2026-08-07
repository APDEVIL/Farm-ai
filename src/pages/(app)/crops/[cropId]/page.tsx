"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { AppTopbar } from "@/components/layout/app-topbar";
import { CropCard } from "@/components/crops/crop-card";

export default function CropDetailPage() {
	const { cropId } = useParams<{ cropId: string }>();
	const router = useRouter();

	const crop = useQuery(api.crops.queries.getCropById, {
		cropId: cropId as Id<"crops">,
	});

	if (crop === undefined) {
		return (
			<div className="flex h-64 items-center justify-center text-[13px] text-[#8A8A7C]">
				Loading...
			</div>
		);
	}

	if (crop === null) {
		return (
			<div className="flex flex-col gap-6">
				<AppTopbar title="Crop not found" onBack={() => router.push("/crops")} />
				<div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center text-[13px] text-[#8A8A7C]">
					This crop doesn't exist, or you don't have access to it.
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				title={crop.name}
				subtitle={crop.variety ?? "Crop details"}
				onBack={() => router.push("/crops")}
			/>

			<div className="max-w-md">
				<CropCard crop={crop} />
			</div>

			{crop.notes && (
				<div className="max-w-md rounded-3xl border border-black/5 bg-white/70 p-5">
					<h3 className="text-[13px] font-semibold text-[#1D1E17]">Notes</h3>
					<p className="mt-1 text-[13px] text-[#4C4C42]">{crop.notes}</p>
				</div>
			)}

			{/* TODO: pull related uploads once you're ready to wire the
			    uploader into this page — filter uploads.listMyUploads by
			    relatedCropId === crop._id */}
		</div>
	);
}