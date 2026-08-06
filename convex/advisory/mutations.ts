import { v } from "convex/values";
import { mutation, internalMutation } from "../_generated/server";
import { requireProfile, requireRole } from "../lib/permissions";
import { advisorySeverity } from "../lib/validators";

/** Admin-only: author a static advisory. System-generated ones (from the
 * weather rule engine) are inserted directly by an internal action instead
 * of going through this public mutation. */
export const createAdvisory = mutation({
	args: {
		title: v.string(),
		body: v.string(),
		cropName: v.optional(v.string()),
		severity: advisorySeverity,
		region: v.optional(v.string()),
		validFrom: v.optional(v.number()),
		validUntil: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const admin = await requireRole(ctx, ["admin"]);
		return await ctx.db.insert("advisories", {
			source: "admin",
			createdBy: admin._id,
			validFrom: args.validFrom ?? Date.now(),
			...args,
		});
	},
});

/** Internal-only: inserted by the weather sync action, not user-callable.
 * Avoids duplicate spam by skipping if an identical system advisory for
 * this region + title is already active. */
export const insertSystemAdvisory = internalMutation({
	args: {
		title: v.string(),
		body: v.string(),
		cropName: v.optional(v.string()),
		severity: advisorySeverity,
		region: v.string(),
		validFrom: v.number(),
		validUntil: v.number(),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		const existing = await ctx.db
			.query("advisories")
			.withIndex("by_region", (q) => q.eq("region", args.region))
			.collect();

		const duplicate = existing.some(
			(a) =>
				a.source === "system" &&
				a.title === args.title &&
				a.validUntil &&
				a.validUntil >= now,
		);
		if (duplicate) return null;

		return await ctx.db.insert("advisories", { source: "system", ...args });
	},
});

async function getOrCreateReceipt(ctx: any, farmerId: any, advisoryId: any) {
	const existing = await ctx.db
		.query("advisoryReceipts")
		.withIndex("by_farmer_advisory", (q: any) =>
			q.eq("farmerId", farmerId).eq("advisoryId", advisoryId),
		)
		.unique();
	if (existing) return existing._id;
	return await ctx.db.insert("advisoryReceipts", { farmerId, advisoryId });
}

export const markRead = mutation({
	args: { advisoryId: v.id("advisories") },
	handler: async (ctx, { advisoryId }) => {
		const profile = await requireProfile(ctx);
		const receiptId = await getOrCreateReceipt(ctx, profile._id, advisoryId);
		await ctx.db.patch(receiptId, { readAt: Date.now() });
	},
});

export const dismiss = mutation({
	args: { advisoryId: v.id("advisories") },
	handler: async (ctx, { advisoryId }) => {
		const profile = await requireProfile(ctx);
		const receiptId = await getOrCreateReceipt(ctx, profile._id, advisoryId);
		await ctx.db.patch(receiptId, { dismissedAt: Date.now() });
	},
});