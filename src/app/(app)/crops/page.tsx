"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { CropCard } from "@/components/crops/crop-card";
import { CropForm } from "@/components/crops/crop-form";
import { AppTopbar } from "@/components/layout/app-topbar";
import { api } from "../../../../convex/_generated/api";

export default function CropsPage() {
	const crops = useQuery(api.crops.queries.listMyCrops);
	const router = useRouter();

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				rightSlot={<CropForm />}
				subtitle="Track what you've planted, from sowing to harvest"
				title="My Crops"
			/>

			{crops === undefined ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{/* FIXED: Avoided using the array index by mapping over hardcoded IDs */}
					{[1, 2, 3].map((skeletonId) => (
						<div
							className="h-40 animate-pulse rounded-3xl bg-white/50"
							key={skeletonId}
						/>
					))}
				</div>
			) : crops.length === 0 ? (
				<div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center">
					<p className="font-medium text-[#1D1E17] text-[14px]">
						No crops added yet
					</p>
					<p className="mt-1 text-[#8A8A7C] text-[13px]">
						Add your first crop to start tracking it and receiving advisories
						relevant to it.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{crops.map((crop) => (
						<button
							className="block w-full cursor-pointer rounded-3xl text-left focus-visible:outline-2 focus-visible:outline-[#8FA857] focus-visible:outline-offset-2"
							key={crop._id}
							onClick={() => router.push(`/crops/${crop._id}`)}
							type="button"
						>
							<CropCard crop={crop} />
						</button>
					))}
				</div>
			)}
		</div>
	);
}
