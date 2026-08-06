import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

// The component handles storing Better Auth's own tables (user, session,
// account, verification) inside Convex for you — no Postgres needed.
export const authComponent = createClient<DataModel>(components.betterAuth);

const siteUrl = process.env.SITE_URL!;

export const createAuth = (ctx: GenericCtx<DataModel>) =>
	betterAuth({
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
		},
		// Required for the Better Auth <-> Convex bridge (JWT verification etc.)
		plugins: [convex({ authConfig })],
		// Uncomment/extend once client requirements are confirmed:
		// socialProviders: { google: { clientId: "...", clientSecret: "..." } },
	});

// Convenience query the frontend can call to get the logged-in user +
// merged app profile (role, farm details) in one round trip.
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) return null;

		const profile = await ctx.db
			.query("profiles")
			.withIndex("by_authUserId", (q) => q.eq("authUserId", authUser._id))
			.unique();

		return { authUser, profile };
	},
});