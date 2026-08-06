import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireProfile } from "../lib/permissions";
import { uploadCategory } from "../lib/validators";

/** Called from your Next.js `onUploadComplete` server callback (via the
 * Convex client) right after Uploadthing finishes storing the file. This
 * mutation just persists the metadata — Uploadthing owns the actual file. */
export const recordUpload = mutation({
	args: {
		uploadthingKey: v.string(),
		url: v.string(),
		fileName: v.string(),
		fileType: v.string(),
		category: uploadCategory,
		relatedCropId: v.optional(v.id("crops")),
	},
	handler: async (ctx, args) => {
		const profile = await requireProfile(ctx);
		return await ctx.db.insert("uploads", {
			ownerId: profile._id,
			...args,
		});
	},
});

/** Owner (or admin) can delete a file's metadata record. Note: this does
 * NOT delete the underlying file from Uploadthing's storage — call
 * Uploadthing's `utapi.deleteFiles(key)` from the Next.js side alongside
 * this, or the file will be orphaned in their storage. */
export const deleteUpload = mutation({
	args: { uploadId: v.id("uploads") },
	handler: async (ctx, { uploadId }) => {
		const profile = await requireProfile(ctx);
		const upload = await ctx.db.get(uploadId);
		if (!upload) throw new Error("Upload not found");

		if (upload.ownerId !== profile._id && profile.role !== "admin") {
			throw new Error("Forbidden: not your upload");
		}

		await ctx.db.delete(uploadId);
	},
});