import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { authComponent } from "../auth";
import { requireProfile, requireRole } from "../lib/permissions";

/** Call once, right after a Better Auth signup, to create the app-level
 * profile row. Defaults role to "farmer" — admins are promoted separately
 * via `setRole`, never self-assigned. */
export const completeProfile = mutation({
	args: {
		fullName: v.string(),
		phone: v.optional(v.string()),
		village: v.optional(v.string()),
		district: v.optional(v.string()),
		state: v.optional(v.string()),
		latitude: v.optional(v.number()),
		longitude: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) throw new Error("Not authenticated");

		const existing = await ctx.db
			.query("profiles")
			.withIndex("by_authUserId", (q) => q.eq("authUserId", authUser._id))
			.unique();
		if (existing) throw new Error("Profile already exists");

		return await ctx.db.insert("profiles", {
			authUserId: authUser._id,
			role: "farmer",
			isActive: true,
			...args,
		});
	},
});

/** Self-service update — a user can edit their own contact/farm details. */
export const updateProfile = mutation({
	args: {
		fullName: v.optional(v.string()),
		phone: v.optional(v.string()),
		village: v.optional(v.string()),
		district: v.optional(v.string()),
		state: v.optional(v.string()),
		latitude: v.optional(v.number()),
		longitude: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const profile = await requireProfile(ctx);
		await ctx.db.patch(profile._id, args);
	},
});

/** Admin-only: promote/demote a user's role. */
export const setRole = mutation({
	args: {
		profileId: v.id("profiles"),
		role: v.union(v.literal("farmer"), v.literal("admin"), v.literal("buyer")),
	},
	handler: async (ctx, { profileId, role }) => {
		await requireRole(ctx, ["admin"]);
		const target = await ctx.db.get(profileId);
		if (!target) throw new Error("Profile not found");
		await ctx.db.patch(profileId, { role });
	},
});

/** Admin-only: deactivate an account (soft-disable, not a hard delete). */
export const setActive = mutation({
	args: { profileId: v.id("profiles"), isActive: v.boolean() },
	handler: async (ctx, { profileId, isActive }) => {
		await requireRole(ctx, ["admin"]);
		const target = await ctx.db.get(profileId);
		if (!target) throw new Error("Profile not found");
		await ctx.db.patch(profileId, { isActive });
	},
});
