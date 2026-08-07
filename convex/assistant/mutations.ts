import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const saveMessage = internalMutation({
	args: {
		farmerId: v.id("profiles"),
		role: v.union(v.literal("user"), v.literal("assistant")),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("assistantMessages", args);
	},
});