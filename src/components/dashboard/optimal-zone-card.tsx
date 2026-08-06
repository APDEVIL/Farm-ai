import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CropChip {
	name: string;
	quantity: string;
	emoji: string;
}

interface OptimalZoneCardProps {
	percentage: number;
	label?: string;
	crops: CropChip[];
	onAddCrop?: () => void;
	className?: string;
}

/** The signature card of the dashboard — a dark "field map" tile with the
 * cultivation-suitability score front and center, plus quick crop chips. */
export function OptimalZoneCard({
	percentage,
	label = "For cultivation",
	crops,
	onAddCrop,
	className,
}: OptimalZoneCardProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-3xl bg-[#1B1D14] p-5",
				className,
			)}
		>
			<div className="flex items-start justify-between">
				<div>
					<span className="inline-block rounded-full bg-[#D6FF4D] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1B1D14]">
						Optimal zone
					</span>
					<div className="mt-3 text-5xl font-semibold tracking-tight text-[#F5F4EC]">
						{percentage}%
					</div>
					<p className="mt-1 text-[13px] text-[#B7B6A8]">{label}</p>
				</div>
			</div>

			<div className="mt-5 flex flex-wrap gap-2">
				{crops.map((crop) => (
					<div
						key={crop.name}
						className="flex items-center gap-2 rounded-full bg-[#2A2D1F] px-3 py-2"
					>
						<span className="text-base leading-none">{crop.emoji}</span>
						<div className="flex flex-col leading-tight">
							<span className="text-[12px] text-[#EDEBDD]">{crop.name}</span>
							<span className="text-[11px] text-[#8C8B7C]">{crop.quantity}</span>
						</div>
					</div>
				))}

				<button
					type="button"
					onClick={onAddCrop}
					className="flex items-center gap-1.5 rounded-full bg-[#D6FF4D] px-4 py-2 text-[12px] font-semibold text-[#1B1D14] transition hover:bg-[#c7f02f]"
				>
					<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
					Add Crop
				</button>
			</div>
		</div>
	);
}