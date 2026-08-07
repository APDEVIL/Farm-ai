"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Sprout,
	CloudSun,
	Store,
	Upload,
	Bell,
	Settings,
	HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";

const NAV_ITEMS = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/crops", label: "Crops", icon: Sprout },
	{ href: "/advisory", label: "Advisory", icon: CloudSun },
	{ href: "/market", label: "Market", icon: Store },
	{ href: "/uploads", label: "Uploads", icon: Upload },
];

/** Light cream sidebar, icon + label nav, black pill on the active route —
 * matches the reference dashboard's left rail exactly (not a dark sidebar,
 * despite what I said earlier in our chat). */
export function AppSidebar() {
	const pathname = usePathname();
	const { profile } = useCurrentUser();

	return (
		<aside className="flex h-screen w-60 shrink-0 flex-col justify-between border-r border-black/5 bg-[#F7F6EF] px-4 py-6">
			<div>
				<div className="flex items-center gap-2 px-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D1E17]">
						<Sprout className="h-4 w-4 text-[#D6FF4D]" strokeWidth={2} />
					</div>
					<span className="text-[15px] font-semibold text-[#1D1E17]">
						AgriAdvisor
					</span>
				</div>

				<nav className="mt-8 flex flex-col gap-1">
					{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
						const active = pathname?.startsWith(href);
						return (
							<Link
								key={href}
								href={href}
								className={cn(
									"flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition",
									active
										? "bg-[#1D1E17] text-white"
										: "text-[#6B6B62] hover:bg-black/5 hover:text-[#1D1E17]",
								)}
							>
								<Icon className="h-4 w-4" strokeWidth={1.75} />
								{label}
							</Link>
						);
					})}
				</nav>
			</div>

			<div>
				<nav className="flex flex-col gap-1">
					<Link
						href="/notifications"
						className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#6B6B62] transition hover:bg-black/5 hover:text-[#1D1E17]"
					>
						<span className="flex items-center gap-3">
							<Bell className="h-4 w-4" strokeWidth={1.75} />
							Notification
						</span>
						<span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D6FF4D] text-[10px] font-semibold text-[#1B1D14]">
							2
						</span>
					</Link>
					<Link
						href="/profile"
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#6B6B62] transition hover:bg-black/5 hover:text-[#1D1E17]"
					>
						<Settings className="h-4 w-4" strokeWidth={1.75} />
						Setting
					</Link>
					<Link
						href="/help"
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#6B6B62] transition hover:bg-black/5 hover:text-[#1D1E17]"
					>
						<HelpCircle className="h-4 w-4" strokeWidth={1.75} />
						Help
					</Link>
				</nav>

				<div className="mt-4 flex items-center gap-2 border-t border-black/5 px-2 pt-4">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFEEE4] text-[12px] font-semibold text-[#1D1E17]">
						{profile?.fullName?.[0]?.toUpperCase() ?? "?"}
					</div>
					<span className="truncate text-[13px] font-medium text-[#1D1E17]">
						{profile?.fullName ?? "Loading..."}
					</span>
				</div>
			</div>
		</aside>
	);
}