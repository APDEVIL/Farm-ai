import { query } from "../_generated/server";
import { requireProfile } from "../lib/permissions";

export const listMyMessages = query({
	args: {},
	handler: async (ctx) => {
		const profile = await requireProfile(ctx);
		return await ctx.db
			.query("assistantMessages")
			.withIndex("by_farmer", (q) => q.eq("farmerId", profile._id))
			.order("asc")
			.take(100);
	},
});