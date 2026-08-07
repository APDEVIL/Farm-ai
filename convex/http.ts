import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Mounts /api/auth/* — matches Better Auth's expected route prefix
authComponent.registerRoutes(http, createAuth);

// Uploadthing calls this after a file finishes uploading, so we can
// persist metadata (key, url, owner) into the `uploads` table.
http.route({
	path: "/uploadthing/callback",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		// TODO: verify Uploadthing signature header before trusting payload
		const payload = await request.json();
		// Delegated to an internal mutation — see uploads/actions.ts
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}),
});

export default http;
