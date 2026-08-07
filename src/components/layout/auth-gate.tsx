"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";

/** Wraps the entire (app) route group. No child page fires a single Convex
 * query until this confirms a real session exists — this is what was
 * missing and caused "Unauthenticated" errors on direct navigation or
 * during session hydration. */
export function AuthGate({ children }: { children: React.ReactNode }) {
	const { isLoading, isAuthenticated } = useConvexAuth();
	const router = useRouter();
	const [graceElapsed, setGraceElapsed] = useState(false);

	// Small grace period before redirecting — protects against the same
	// class of timing race as the login/signup pages hit: isLoading can
	// briefly resolve to false before Convex has truly settled the auth
	// state (e.g. right after a page refresh with a fresh session cookie).
	useEffect(() => {
		const t = setTimeout(() => setGraceElapsed(true), 400);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		if (!isLoading && !isAuthenticated && graceElapsed) {
			router.replace("/login");
		}
	}, [isLoading, isAuthenticated, graceElapsed, router]);

	if (isLoading || !isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#EDEBDF] text-[13px] text-[#8A8A7C]">
				Loading...
			</div>
		);
	}

	return <>{children}</>;
}