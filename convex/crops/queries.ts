import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireProfile, requireRole } from "../lib/permissions";

/** All crops belonging to the logged-in farmer. */
export const listMyCrops = query({
	args: {},
	handler: async (ctx) => {
		const profile = await requireProfile(ctx);
		return await ctx.db
			.query("crops")
			.withIndex("by_farmer", (q) => q.eq("farmerId", profile._id))
			.collect();
	},
});

/** A single crop — owner or admin only. */
export const getCropById = query({
	args: { cropId: v.id("crops") },
	handler: async (ctx, { cropId }) => {
		const profile = await requireProfile(ctx);
		const crop = await ctx.db.get(cropId);
		if (!crop) return null;

		if (crop.farmerId !== profile._id && profile.role !== "admin") {
			throw new Error("Forbidden: not your crop");
		}
		return crop;
	},
});

/** Admin-only: view any farmer's crop list, optionally filtered by status. */
export const listByFarmer = query({
	args: {
		farmerId: v.id("profiles"),
		status: v.optional(
			v.union(
				v.literal("planned"),
				v.literal("growing"),
				v.literal("harvested"),
			),
		),
	},
	handler: async (ctx, { farmerId, status }) => {
		await requireRole(ctx, ["admin"]);

		if (status) {
			return await ctx.db
				.query("crops")
				.withIndex("by_farmer_status", (q) =>
					q.eq("farmerId", farmerId).eq("status", status),
				)
				.collect();
		}

		return await ctx.db
			.query("crops")
			.withIndex("by_farmer", (q) => q.eq("farmerId", farmerId))
			.collect();
	},
});
