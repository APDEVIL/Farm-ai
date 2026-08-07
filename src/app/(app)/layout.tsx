import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AuthGate } from "@/components/layout/auth-gate";

export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<AuthGate>
			<div className="flex min-h-screen bg-[#EDEBDF]">
				<AppSidebar />
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</AuthGate>
	);
}