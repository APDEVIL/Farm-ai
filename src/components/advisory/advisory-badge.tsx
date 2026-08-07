import { Info, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "info" | "warning" | "critical";

const CONFIG: Record<
	Severity,
	{ label: string; icon: typeof Info; className: string }
> = {
	info: {
		label: "Info",
		icon: Info,
		className: "bg-[#EAF1FB] text-[#2E5C99] border-[#B9D4F0]",
	},
	warning: {
		label: "Warning",
		icon: AlertTriangle,
		className: "bg-[#FBF3D9] text-[#8A6A0E] border-[#EBD98C]",
	},
	critical: {
		label: "Critical",
		icon: AlertOctagon,
		className: "bg-[#FBE7E4] text-[#B23A2B] border-[#EFB3A9]",
	},
};

export function AdvisoryBadge({ severity }: { severity: Severity }) {
	const { label, icon: Icon, className } = CONFIG[severity];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium text-[11px]",
				className,
			)}
		>
			<Icon className="h-3 w-3" strokeWidth={2} />
			{label}
		</span>
	);
}