"use client";

import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";

/** Convenience hook for the logged-in user's app profile (role, farm info).
 * Wraps Convex's own auth-loading state so components don't have to juggle
 * two separate loading flags. */
export function useCurrentUser() {
	const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
	const profile = useQuery(
		api.users.queries.getMyProfile,
		isAuthenticated ? {} : "skip",
	);

	return {
		isLoading: authLoading || (isAuthenticated && profile === undefined),
		isAuthenticated,
		profile: profile ?? null,
		// True once we know the user is authenticated but has no profile row
		// yet — use this to redirect into the onboarding/completeProfile flow.
		needsOnboarding: isAuthenticated && profile === null,
	};
}