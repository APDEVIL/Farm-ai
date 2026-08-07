import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

interface AppTopbarProps {
	title: string;
	subtitle?: string;
	onBack?: () => void;
	/** Context pills like "Soil Watering 12h" / "Location Nebraska" from the
	 * reference — pass whatever chips make sense for the current page. */
	rightSlot?: ReactNode;
	className?: string;
}

export function AppTopbar({
	title,
	subtitle,
	onBack,
	rightSlot,
	className,
}: AppTopbarProps) {
	return (
		<header className={cn("flex items-center justify-between", className)}>
			<div className="flex items-center gap-3">
				{onBack && (
					<button
						aria-label="Go back"
						className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[#1D1E17] transition hover:bg-white"
						onClick={onBack}
						type="button"
					>
						<ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
					</button>
				)}
				<div>
					<h1 className="font-semibold text-[#1D1E17] text-[18px]">{title}</h1>
					{subtitle && <p className="text-[#8A8A7C] text-[12px]">{subtitle}</p>}
				</div>
			</div>

			<div className="flex items-center gap-3">
				{rightSlot}
				<UserMenu />
			</div>
		</header>
	);
}
