import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireProfile } from "../lib/permissions";

/** Latest recorded price per commodity (most recent priceDate). Public to
 * any authenticated user — farmers and buyers both need this. */
export const getLatestPrices = query({
	args: { commodity: v.string() },
	handler: async (ctx, { commodity }) => {
		await requireProfile(ctx);
		const rows = await ctx.db
			.query("marketPrices")
			.withIndex("by_commodity_date", (q) => q.eq("commodity", commodity))
			.order("desc")
			.take(50); // most recent batch across markets/states
		return rows;
	},
});

/** Price history for a commodity within a date range — for charting. */
export const getPriceHistory = query({
	args: {
		commodity: v.string(),
		fromDate: v.string(), // "YYYY-MM-DD"
		toDate: v.string(),
	},
	handler: async (ctx, { commodity, fromDate, toDate }) => {
		await requireProfile(ctx);
		return await ctx.db
			.query("marketPrices")
			.withIndex("by_commodity_date", (q) =>
				q
					.eq("commodity", commodity)
					.gte("priceDate", fromDate)
					.lte("priceDate", toDate),
			)
			.collect();
	},
});

/** All commodities currently tracked for a given state. */
export const listByState = query({
	args: { state: v.string() },
	handler: async (ctx, { state }) => {
		await requireProfile(ctx);
		return await ctx.db
			.query("marketPrices")
			.withIndex("by_state_commodity", (q) => q.eq("state", state))
			.order("desc")
			.take(100);
	},
});