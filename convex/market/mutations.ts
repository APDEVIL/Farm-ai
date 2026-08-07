import { v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";
import { requireRole } from "../lib/permissions";

/** Admin-only: manually enter/seed a price (used when Agmarknet has no data
 * for a commodity/market, per your "API if available, else seed" answer). */
export const recordPrice = mutation({
	args: {
		commodity: v.string(),
		variety: v.optional(v.string()),
		market: v.string(),
		state: v.string(),
		district: v.optional(v.string()),
		minPrice: v.number(),
		maxPrice: v.number(),
		modalPrice: v.number(),
		priceDate: v.string(),
	},
	handler: async (ctx, args) => {
		const admin = await requireRole(ctx, ["admin"]);
		return await ctx.db.insert("marketPrices", {
			...args,
			source: "manual",
			enteredBy: admin._id,
		});
	},
});

/** Internal-only: called by the Agmarknet sync action. Upserts on
 * (commodity, market, priceDate) so re-running the sync doesn't duplicate
 * rows for a day that's already been recorded. */
export const upsertFromAgmarknet = internalMutation({
	args: {
		commodity: v.string(),
		variety: v.optional(v.string()),
		market: v.string(),
		state: v.string(),
		district: v.optional(v.string()),
		minPrice: v.number(),
		maxPrice: v.number(),
		modalPrice: v.number(),
		priceDate: v.string(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("marketPrices")
			.withIndex("by_commodity_date", (q) =>
				q.eq("commodity", args.commodity).eq("priceDate", args.priceDate),
			)
			.collect();

		const match = existing.find(
			(r) => r.market === args.market && r.source === "agmarknet",
		);

		if (match) {
			await ctx.db.patch(match._id, args);
			return match._id;
		}

		return await ctx.db.insert("marketPrices", {
			...args,
			source: "agmarknet",
		});
	},
});
