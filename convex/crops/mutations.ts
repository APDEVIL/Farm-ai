import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireProfile } from "../lib/permissions";
import { cropStatus } from "../lib/validators";

async function requireOwnerOrAdmin(
	ctx: Parameters<typeof requireProfile>[0],
	cropId: any,
) {
	const profile = await requireProfile(ctx);
	const crop = await (ctx as any).db.get(cropId);
	if (!crop) throw new Error("Crop not found");
	if (crop.farmerId !== profile._id && profile.role !== "admin") {
		throw new Error("Forbidden: not your crop");
	}
	return { profile, crop };
}

export const addCrop = mutation({
	args: {
		name: v.string(),
		variety: v.optional(v.string()),
		areaAcres: v.optional(v.number()),
		sownDate: v.optional(v.number()),
		expectedHarvestDate: v.optional(v.number()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const profile = await requireProfile(ctx);
		return await ctx.db.insert("crops", {
			farmerId: profile._id,
			status: "planned",
			...args,
		});
	},
});

export const updateCrop = mutation({
	args: {
		cropId: v.id("crops"),
		name: v.optional(v.string()),
		variety: v.optional(v.string()),
		areaAcres: v.optional(v.number()),
		sownDate: v.optional(v.number()),
		expectedHarvestDate: v.optional(v.number()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, { cropId, ...patch }) => {
		await requireOwnerOrAdmin(ctx, cropId);
		await ctx.db.patch(cropId, patch);
	},
});

export const updateCropStatus = mutation({
	args: { cropId: v.id("crops"), status: cropStatus },
	handler: async (ctx, { cropId, status }) => {
		await requireOwnerOrAdmin(ctx, cropId);
		await ctx.db.patch(cropId, { status });
	},
});

export const deleteCrop = mutation({
	args: { cropId: v.id("crops") },
	handler: async (ctx, { cropId }) => {
		await requireOwnerOrAdmin(ctx, cropId);
		await ctx.db.delete(cropId);
	},
});