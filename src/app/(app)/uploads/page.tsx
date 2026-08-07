"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { AppTopbar } from "@/components/layout/app-topbar";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

const TABS = [
	{ key: "crop_image", label: "Crop Images" },
	{ key: "certificate", label: "Certificates" },
	{ key: "id_proof", label: "ID Proof" },
	{ key: "other", label: "Other" },
] as const;

type CategoryKey = (typeof TABS)[number]["key"];

export default function UploadsPage() {
	const [category, setCategory] = useState<CategoryKey>("crop_image");
	const uploads = useQuery(api.uploads.queries.listMyUploads, { category });
	const deleteUpload = useMutation(api.uploads.mutations.deleteUpload);

	async function handleDelete(uploadId: Id<"uploads">) {
		try {
			await deleteUpload({ uploadId });
			toast.success("Removed");
		} catch {
			toast.error("Couldn't remove file");
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				title="Uploads"
				subtitle="Crop images, certificates, and ID documents"
				rightSlot={
					category === "crop_image" ? (
						<UploadButton
							endpoint="cropImage"
							onClientUploadComplete={() => {
								toast.success("Uploaded");
							}}
							onUploadError={() => {
								toast.error("Upload failed");
							}}
						/>
					) : (
						<UploadButton
							endpoint="document"
							input={{ category }}
							onClientUploadComplete={() => {
								toast.success("Uploaded");
							}}
							onUploadError={() => {
								toast.error("Upload failed");
							}}
						/>
					)
				}
			/>

			<div className="flex gap-1 rounded-full bg-[#EFEEE4] p-1 self-start">
				{TABS.map((t) => (
					<button
						key={t.key}
						type="button"
						onClick={() => setCategory(t.key)}
						className={cn(
							"rounded-full px-3 py-1.5 text-[12px] font-medium transition",
							category === t.key
								? "bg-[#D6FF4D] text-[#1B1D14]"
								: "text-[#8A8A7C] hover:text-[#1D1E17]",
						)}
					>
						{t.label}
					</button>
				))}
			</div>

			{uploads === undefined ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-32 animate-pulse rounded-2xl bg-white/50" />
					))}
				</div>
			) : uploads.length === 0 ? (
				<div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center text-[13px] text-[#8A8A7C]">
					No files here yet.
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{uploads.map((u) => (
						<div
							key={u._id}
							className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white/70"
						>
							{u.fileType.startsWith("image/") ? (
								<img
									src={u.url}
									alt={u.fileName}
									className="h-24 w-full object-cover"
								/>
							) : (
								<div className="flex h-24 w-full items-center justify-center bg-[#EFEEE4]">
									<FileText className="h-6 w-6 text-[#8A8A7C]" />
								</div>
							)}
							<p className="truncate px-2 py-1.5 text-[11px] text-[#4C4C42]">
								{u.fileName}
							</p>
							<button
								type="button"
								onClick={() => handleDelete(u._id)}
								className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
								aria-label="Delete file"
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}