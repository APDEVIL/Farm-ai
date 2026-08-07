"use client";

import {
	Bell,
	CloudSun,
	HelpCircle,
	LayoutDashboard,
	Settings,
	Sprout,
	Store,
	Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

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
		<aside className="flex h-screen w-60 shrink-0 flex-col justify-between border-black/5 border-r bg-[#F7F6EF] px-4 py-6">
			<div>
				<div className="flex items-center gap-2 px-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D1E17]">
						<Sprout className="h-4 w-4 text-[#D6FF4D]" strokeWidth={2} />
					</div>
					<span className="font-semibold text-[#1D1E17] text-[15px]">
						AgriAdvisor
					</span>
				</div>

				<nav className="mt-8 flex flex-col gap-1">
					{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
						const active = pathname?.startsWith(href);
						return (
							<Link
								className={cn(
									"flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-[13px] transition",
									active
										? "bg-[#1D1E17] text-white"
										: "text-[#6B6B62] hover:bg-black/5 hover:text-[#1D1E17]",
								)}
								href={href}
								key={href}
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
						className="flex items-center justify-between rounded-xl px-3 py-2.5 font-medium text-[#6B6B62] text-[13px] transition hover:bg-black/5 hover:text-[#1D1E17]"
						href="/notifications"
					>
						<span className="flex items-center gap-3">
							<Bell className="h-4 w-4" strokeWidth={1.75} />
							Notification
						</span>
						<span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D6FF4D] font-semibold text-[#1B1D14] text-[10px]">
							2
						</span>
					</Link>
					<Link
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-[#6B6B62] text-[13px] transition hover:bg-black/5 hover:text-[#1D1E17]"
						href="/profile"
					>
						<Settings className="h-4 w-4" strokeWidth={1.75} />
						Setting
					</Link>
					<Link
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-[#6B6B62] text-[13px] transition hover:bg-black/5 hover:text-[#1D1E17]"
						href="/help"
					>
						<HelpCircle className="h-4 w-4" strokeWidth={1.75} />
						Help
					</Link>
				</nav>

				<div className="mt-4 flex items-center gap-2 border-black/5 border-t px-2 pt-4">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFEEE4] font-semibold text-[#1D1E17] text-[12px]">
						{profile?.fullName?.[0]?.toUpperCase() ?? "?"}
					</div>
					<span className="truncate font-medium text-[#1D1E17] text-[13px]">
						{profile?.fullName ?? "Loading..."}
					</span>
				</div>
			</div>
		</aside>
	);
}
