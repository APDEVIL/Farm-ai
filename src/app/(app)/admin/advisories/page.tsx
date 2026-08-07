"use client";

import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdvisoryList } from "@/components/advisory/advisory-list";
import { AppTopbar } from "@/components/layout/app-topbar";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../../../convex/_generated/api";

function CreateAdvisoryDialog() {
	const createAdvisory = useMutation(api.advisory.mutations.createAdvisory);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [severity, setSeverity] = useState<"info" | "warning" | "critical">(
		"info",
	);
	const [region, setRegion] = useState("");
	const [cropName, setCropName] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!title.trim() || !body.trim()) {
			toast.error("Title and body are required");
			return;
		}
		setSubmitting(true);
		try {
			await createAdvisory({
				title: title.trim(),
				body: body.trim(),
				severity,
				region: region.trim() || undefined,
				cropName: cropName.trim() || undefined,
			});
			toast.success("Advisory published");
			setTitle("");
			setBody("");
			setRegion("");
			setCropName("");
			setSeverity("info");
			setOpen(false);
		} catch {
			toast.error("Couldn't publish advisory");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger className="flex items-center gap-1.5 rounded-full bg-[#D6FF4D] px-4 py-2 font-semibold text-[#1B1D14] text-[12px] transition hover:bg-[#c7f02f]">
				<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
				New advisory
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Publish an advisory</DialogTitle>
				</DialogHeader>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-1.5">
						<Label htmlFor="adv-title">Title</Label>
						<Input
							id="adv-title"
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Delay pesticide application"
							required
							value={title}
						/>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="adv-body">Details</Label>
						<Textarea
							id="adv-body"
							onChange={(e) => setBody(e.target.value)}
							placeholder="Full advisory text shown to farmers"
							required
							value={body}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="adv-severity">Severity</Label>
							<select
								className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-[13px]"
								id="adv-severity"
								onChange={(e) => setSeverity(e.target.value as typeof severity)}
								value={severity}
							>
								<option value="info">Info</option>
								<option value="warning">Warning</option>
								<option value="critical">Critical</option>
							</select>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="adv-region">Region (optional)</Label>
							<Input
								id="adv-region"
								onChange={(e) => setRegion(e.target.value)}
								placeholder="District"
								value={region}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="adv-crop">Crop (optional)</Label>
						<Input
							id="adv-crop"
							onChange={(e) => setCropName(e.target.value)}
							placeholder="Leave blank for a general advisory"
							value={cropName}
						/>
					</div>

					<DialogFooter>
						<button
							className="w-full rounded-full bg-[#D6FF4D] px-4 py-2.5 font-semibold text-[#1B1D14] text-[13px] transition hover:bg-[#c7f02f] disabled:opacity-60"
							disabled={submitting}
							type="submit"
						>
							{submitting ? "Publishing..." : "Publish"}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminAdvisoriesPage() {
	const advisories = useQuery(api.advisory.queries.listAllAdvisories);

	return (
		<AdminGuard>
			<div className="flex flex-col gap-6">
				<AppTopbar
					rightSlot={<CreateAdvisoryDialog />}
					subtitle="Publish and review advisories sent to farmers"
					title="Advisories"
				/>

				{advisories === undefined ? (
					<div className="h-24 animate-pulse rounded-3xl bg-white/50" />
				) : (
					<AdvisoryList advisories={advisories} interactive={false} />
				)}
			</div>
		</AdminGuard>
	);
}
