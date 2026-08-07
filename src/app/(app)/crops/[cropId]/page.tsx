"use client";

import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { CropCard } from "@/components/crops/crop-card";
import { AppTopbar } from "@/components/layout/app-topbar";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

export default function CropDetailPage() {
	const { cropId } = useParams<{ cropId: string }>();
	const router = useRouter();

	const crop = useQuery(api.crops.queries.getCropById, {
		cropId: cropId as Id<"crops">,
	});

	if (crop === undefined) {
		return (
			<div className="flex h-64 items-center justify-center text-[#8A8A7C] text-[13px]">
				Loading...
			</div>
		);
	}

	if (crop === null) {
		return (
			<div className="flex flex-col gap-6">
				<AppTopbar
					onBack={() => router.push("/crops")}
					title="Crop not found"
				/>
				<div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center text-[#8A8A7C] text-[13px]">
					This crop doesn't exist, or you don't have access to it.
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				onBack={() => router.push("/crops")}
				subtitle={crop.variety ?? "Crop details"}
				title={crop.name}
			/>

			<div className="max-w-md">
				<CropCard crop={crop} />
			</div>

			{crop.notes && (
				<div className="max-w-md rounded-3xl border border-black/5 bg-white/70 p-5">
					<h3 className="font-semibold text-[#1D1E17] text-[13px]">Notes</h3>
					<p className="mt-1 text-[#4C4C42] text-[13px]">{crop.notes}</p>
				</div>
			)}

			{/* TODO: pull related uploads once you're ready to wire the
			    uploader into this page — filter uploads.listMyUploads by
			    relatedCropId === crop._id */}
		</div>
	);
}
