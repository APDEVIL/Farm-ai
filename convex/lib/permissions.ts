import type { MutationCtx, QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";

export type Role = "farmer" | "admin" | "buyer";

/** Throws if no user is logged in; otherwise returns the profile row. */
export async function requireProfile(ctx: QueryCtx | MutationCtx) {
	const authUser = await authComponent.getAuthUser(ctx);
	if (!authUser) throw new Error("Not authenticated");

	const profile = await ctx.db
		.query("profiles")
		.withIndex("by_authUserId", (q) => q.eq("authUserId", authUser._id))
		.unique();

	if (!profile) throw new Error("Profile not found for authenticated user");
	if (!profile.isActive) throw new Error("Account is deactivated");

	return profile;
}

/** Throws unless the current user's role is in `allowed`. */
export async function requireRole(
	ctx: QueryCtx | MutationCtx,
	allowed: Role[],
) {
	const profile = await requireProfile(ctx);
	if (!allowed.includes(profile.role)) {
		throw new Error(
			`Forbidden: requires role ${allowed.join(" or ")}, got ${profile.role}`,
		);
	}
	return profile;
}
