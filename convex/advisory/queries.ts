import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireProfile, requireRole } from "../lib/permissions";

/** Advisories currently valid for the logged-in farmer's region, plus any
 * general (region-less) advisories. Filters out expired ones. */
export const listActiveAdvisories = query({
	args: {},
	handler: async (ctx) => {
		const profile = await requireProfile(ctx);
		const now = Date.now();

		const regional = profile.district
			? await ctx.db
					.query("advisories")
					.withIndex("by_region", (q) => q.eq("region", profile.district))
					.collect()
			: [];

		// NOTE: querying an optional field for "undefined" via withIndex can be
		// finicky depending on Convex version — if this doesn't return general
		// advisories as expected, fall back to `.filter((q) => q.eq(q.field("region"), undefined))`
		// or store general advisories with a sentinel region like "ALL" instead.
		const general = await ctx.db
			.query("advisories")
			.withIndex("by_region", (q) => q.eq("region", undefined))
			.collect();

		return [...regional, ...general].filter(
			(a) => a.validFrom <= now && (!a.validUntil || a.validUntil >= now),
		);
	},
});

export const getAdvisoryById = query({
	args: { advisoryId: v.id("advisories") },
	handler: async (ctx, { advisoryId }) => {
		await requireProfile(ctx);
		return await ctx.db.get(advisoryId);
	},
});

/** Advisories the farmer hasn't read or dismissed yet, cross-referenced
 * against their advisoryReceipts rows. */
export const listUnread = query({
	args: {},
	handler: async (ctx) => {
		const profile = await requireProfile(ctx);
		const now = Date.now();

		// TODO: full table scan — fine for MVP scale, but once advisories grow
		// large, replace with a validFrom-indexed range query.
		const active = await ctx.db
			.query("advisories")
			.collect()
			.then((all) =>
				all.filter(
					(a) => a.validFrom <= now && (!a.validUntil || a.validUntil >= now),
				),
			);

		const receipts = await ctx.db
			.query("advisoryReceipts")
			.withIndex("by_farmer", (q) => q.eq("farmerId", profile._id))
			.collect();

		const handled = new Set(
			receipts
				.filter((r) => r.readAt || r.dismissedAt)
				.map((r) => r.advisoryId),
		);

		return active.filter((a) => !handled.has(a._id));
	},
});

/** Admin-only: every advisory regardless of region, most recent first —
 * used by the admin advisories management page. */
export const listAllAdvisories = query({
	args: {},
	handler: async (ctx) => {
		await requireRole(ctx, ["admin"]);
		return await ctx.db.query("advisories").order("desc").take(100);
	},
});