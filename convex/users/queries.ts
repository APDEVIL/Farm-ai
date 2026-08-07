import { v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
import { requireProfile, requireRole } from "../lib/permissions";

/** The logged-in user's own profile. Returns null if none exists yet
 * (e.g. right after signup, before `completeProfile` has run). */
export const getMyProfile = query({
	args: {},
	handler: async (ctx) => {
		try {
			return await requireProfile(ctx);
		} catch {
			return null;
		}
	},
});

/** Admins can look up any farmer's profile; buyers can look up a farmer's
 * public info (used e.g. when viewing crop listings tied to that farmer). */
export const getProfileById = query({
	args: { profileId: v.id("profiles") },
	handler: async (ctx, { profileId }) => {
		const requester = await requireProfile(ctx);
		const target = await ctx.db.get(profileId);
		if (!target) return null;

		if (requester.role === "admin" || requester._id === target._id) {
			return target; // full record
		}

		// Buyers (or anyone else) only get non-sensitive public fields
		return {
			_id: target._id,
			fullName: target.fullName,
			village: target.village,
			district: target.district,
			state: target.state,
			role: target.role,
		};
	},
});

/** Admin-only: list all users of a given role, e.g. for a farmer directory. */
export const listByRole = query({
	args: {
		role: v.union(v.literal("farmer"), v.literal("admin"), v.literal("buyer")),
	},
	handler: async (ctx, { role }) => {
		await requireRole(ctx, ["admin"]);
		return await ctx.db
			.query("profiles")
			.withIndex("by_role", (q) => q.eq("role", role))
			.collect();
	},
});

/** Internal-only: one row per distinct farmer location (district + lat/lon),
 * used by the weather sync action so we don't call the weather API once per
 * farmer — only once per unique place. */
export const listDistinctFarmerRegions = internalQuery({
	args: {},
	handler: async (ctx) => {
		const farmers = await ctx.db
			.query("profiles")
			.withIndex("by_role", (q) => q.eq("role", "farmer"))
			.collect();

		const seen = new Map<
			string,
			{ district: string; latitude: number; longitude: number }
		>();

		for (const f of farmers) {
			if (!f.district || f.latitude == null || f.longitude == null) continue;
			if (!seen.has(f.district)) {
				seen.set(f.district, {
					district: f.district,
					latitude: f.latitude,
					longitude: f.longitude,
				});
			}
		}

		return Array.from(seen.values());
	},
});
