import Image from "next/image";
import { cn } from "@/lib/utils";

interface AdvisoryTipCardProps {
	imageUrl: string;
	imageAlt?: string;
	message: string;
	ctaLabel?: string;
	onCtaClick?: () => void;
	className?: string;
}

/** Overlay card pairing a farmer/field photo with a short advisory tip and
 * a "See details" CTA — drives the farmer toward the full advisory record. */
export function AdvisoryTipCard({
	imageUrl,
	imageAlt = "Farmer in the field",
	message,
	ctaLabel = "See details",
	onCtaClick,
	className,
}: AdvisoryTipCardProps) {
	return (
		<div className={cn("relative flex items-end gap-4", className)}>
			<div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-3xl">
				<Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
			</div>

			<div className="max-w-[220px] pb-2">
				<p className="text-[13px] leading-snug text-[#3A3B30]">{message}</p>
				<button
					type="button"
					onClick={onCtaClick}
					className="mt-3 rounded-full bg-[#D6FF4D] px-4 py-2 text-[12px] font-semibold text-[#1B1D14] transition hover:bg-[#c7f02f]"
				>
					{ctaLabel}
				</button>
			</div>
		</div>
	);
}