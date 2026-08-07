import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen bg-[#EDEBDF]">
			<AppSidebar />
			<main className="flex-1 overflow-y-auto p-6">{children}</main>
		</div>
	);
}