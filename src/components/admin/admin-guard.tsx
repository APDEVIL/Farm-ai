"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

/** Wrap any /admin page with this. Redirects non-admins to /dashboard.
 * This is a UX convenience only — the real security boundary is
 * `requireRole(ctx, ["admin"])` inside each Convex mutation/query, which
 * enforces this server-side regardless of what the client does. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
	const { isLoading, profile } = useCurrentUser();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && profile && profile.role !== "admin") {
			router.replace("/dashboard");
		}
	}, [isLoading, profile, router]);

	if (isLoading || !profile || profile.role !== "admin") {
		return (
			<div className="flex h-64 items-center justify-center text-[13px] text-[#8A8A7C]">
				Checking access...
			</div>
		);
	}

	return <>{children}</>;
}