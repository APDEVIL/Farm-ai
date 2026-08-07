import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/server/better-auth";
import { api } from "../../../../convex/_generated/api";

const f = createUploadthing();
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function getSessionUser() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) throw new UploadThingError("Unauthorized");
	return session.user;
}

export const uploadRouter = {
	cropImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
		.middleware(async () => {
			const user = await getSessionUser();
			return { userId: user.id };
		})
		.onUploadComplete(async ({ file }) => {
			await convex.mutation(api.uploads.mutations.recordUpload, {
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
		.middleware(async () => {
			const user = await getSessionUser();
			return { userId: user.id };
		})
		.onUploadComplete(async ({ file }) => {
			await convex.mutation(api.uploads.mutations.recordUpload, {
				uploadthingKey: file.key,
				url: file.ufsUrl,
				fileName: file.name,
				fileType: file.type,
				category: "certificate", // adjust per-upload if you split cert/ID proof
			});
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
