"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/server/better-auth/client";

export function UserMenu() {
	const router = useRouter();
	const { profile } = useCurrentUser();

	async function handleSignOut() {
		await authClient.signOut();
		toast.success("Signed out");
		router.push("/login");
	}

	const initial = profile?.fullName?.[0]?.toUpperCase() ?? "?";

	return (
		<DropdownMenu>
			{/* FIXED: Removed asChild and the inner <button>. 
			    DropdownMenuTrigger acts as a button natively. */}
			<DropdownMenuTrigger
				aria-label="Open user menu"
				className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 outline-none transition hover:bg-white focus:ring-2 focus:ring-[#D6FF4D]"
			>
				<Avatar className="h-8 w-8">
					<AvatarFallback className="bg-[#1D1E17] font-semibold text-[#D6FF4D] text-[12px]">
						{initial}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem onClick={() => router.push("/profile")}>
					<User className="mr-2 h-4 w-4" />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => router.push("/settings")}>
					<Settings className="mr-2 h-4 w-4" />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-600 focus:text-red-600"
					onClick={handleSignOut}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
