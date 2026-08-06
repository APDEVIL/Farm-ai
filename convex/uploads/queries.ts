import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireProfile, requireRole } from "../lib/permissions";
import { uploadCategory } from "../lib/validators";

export const listMyUploads = query({
	args: { category: v.optional(uploadCategory) },
	handler: async (ctx, { category }) => {
		const profile = await requireProfile(ctx);

		if (category) {
			return await ctx.db
				.query("uploads")
				.withIndex("by_owner_category", (q) =>
					q.eq("ownerId", profile._id).eq("category", category),
				)
				.collect();
		}

		return await ctx.db
			.query("uploads")
			.withIndex("by_owner", (q) => q.eq("ownerId", profile._id))
			.collect();
	},
});

/** Admin-only: view any user's uploads (e.g. reviewing a farmer's
 * submitted certificate/ID proof). */
export const listUploadsByOwner = query({
	args: { ownerId: v.id("profiles") },
	handler: async (ctx, { ownerId }) => {
		await requireRole(ctx, ["admin"]);
		return await ctx.db
			.query("uploads")
			.withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
			.collect();
	},
});