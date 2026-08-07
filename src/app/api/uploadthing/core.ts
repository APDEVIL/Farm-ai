import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { fetchAuthQuery, fetchAuthMutation } from "@/server/better-auth/auth-server";
import { api } from "../../../../convex/_generated/api";

const f = createUploadthing();

/** Verifies the request against the REAL Convex-backed session (not the
 * old standalone better-auth instance) via fetchAuthQuery, which reads
 * the session cookie automatically. Throws if there's no valid session. */
async function requireAuthedProfile() {
	const current = await fetchAuthQuery(api.auth.getCurrentUser, {});
	if (!current?.profile) {
		throw new UploadThingError("Unauthorized");
	}
	return current.profile;
}

export const uploadRouter = {
	cropImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
		.middleware(async () => {
			const profile = await requireAuthedProfile();
			return { profileId: profile._id };
		})
		.onUploadComplete(async ({ file }) => {
			await fetchAuthMutation(api.uploads.mutations.recordUpload, {
				uploadthingKey: file.key,
				url: file.ufsUrl,
				fileName: file.name,
				fileType: file.type,
				category: "crop_image",
			});
		}),

	document: f({
		pdf: { maxFileSize: "8MB", maxFileCount: 3 },
		image: { maxFileSize: "8MB", maxFileCount: 3 },
	})
		.input(
			z.object({
				category: z.enum(["certificate", "id_proof", "other"]),
			}),
		)
		.middleware(async ({ input }) => {
			const profile = await requireAuthedProfile();
			return { profileId: profile._id, category: input.category };
		})
		.onUploadComplete(async ({ file, metadata }) => {
			await fetchAuthMutation(api.uploads.mutations.recordUpload, {
				uploadthingKey: file.key,
				url: file.ufsUrl,
				fileName: file.name,
				fileType: file.type,
				category: metadata.category,
			});
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;