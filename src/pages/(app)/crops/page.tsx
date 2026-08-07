"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { AppTopbar } from "@/components/layout/app-topbar";
import { CropCard } from "@/components/crops/crop-card";
import { CropForm } from "@/components/crops/crop-form";

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
							key={skeletonId}
							className="h-40 animate-pulse rounded-3xl bg-white/50"
						/>
					))}
				</div>
			) : crops.length === 0 ? (
				<div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center">
					<p className="text-[14px] font-medium text-[#1D1E17]">
						No crops added yet
					</p>
					<p className="mt-1 text-[13px] text-[#8A8A7C]">
						Add your first crop to start tracking it and receiving
						advisories relevant to it.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{crops.map((crop) => (
						<button
							key={crop._id}
							className="block w-full cursor-pointer rounded-3xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FA857]"
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