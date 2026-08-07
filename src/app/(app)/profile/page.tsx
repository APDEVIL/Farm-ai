"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "../../../../convex/_generated/api";
import { AppTopbar } from "@/components/layout/app-topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
	const { isLoading, profile, needsOnboarding } = useCurrentUser();
	const completeProfile = useMutation(api.users.mutations.completeProfile);
	const updateProfile = useMutation(api.users.mutations.updateProfile);

	const [form, setForm] = useState({
		fullName: "",
		phone: "",
		village: "",
		district: "",
		state: "",
	});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (profile) {
			setForm({
				fullName: profile.fullName ?? "",
				phone: profile.phone ?? "",
				village: profile.village ?? "",
				district: profile.district ?? "",
				state: profile.state ?? "",
			});
		}
	}, [profile]);

	function update<K extends keyof typeof form>(key: K, value: string) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.fullName.trim()) {
			toast.error("Full name is required");
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				fullName: form.fullName.trim(),
				phone: form.phone.trim() || undefined,
				village: form.village.trim() || undefined,
				district: form.district.trim() || undefined,
				state: form.state.trim() || undefined,
			};

			if (needsOnboarding) {
				await completeProfile(payload);
				toast.success("Profile created");
			} else {
				await updateProfile(payload);
				toast.success("Profile updated");
			}
		} catch {
			toast.error("Couldn't save profile");
		} finally {
			setSubmitting(false);
		}
	}

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center text-[13px] text-[#8A8A7C]">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				title={needsOnboarding ? "Complete your profile" : "Profile"}
				subtitle={
					needsOnboarding
						? "A few details before you get started"
						: "Update your contact and farm details"
				}
			/>

			<form
				onSubmit={handleSubmit}
				className="max-w-md space-y-4 rounded-3xl border border-black/5 bg-white/70 p-6 backdrop-blur-sm"
			>
				<div className="space-y-1.5">
					<Label htmlFor="p-name">Full name</Label>
					<Input
						id="p-name"
						value={form.fullName}
						onChange={(e) => update("fullName", e.target.value)}
						required
					/>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="p-phone">Phone</Label>
					<Input
						id="p-phone"
						value={form.phone}
						onChange={(e) => update("phone", e.target.value)}
						placeholder="Optional"
					/>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="p-village">Village</Label>
					<Input
						id="p-village"
						value={form.village}
						onChange={(e) => update("village", e.target.value)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5">
						<Label htmlFor="p-district">District</Label>
						<Input
							id="p-district"
							value={form.district}
							onChange={(e) => update("district", e.target.value)}
						/>
						<p className="text-[11px] text-[#8A8A7C]">
							Used to match weather advisories to your area
						</p>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="p-state">State</Label>
						<Input
							id="p-state"
							value={form.state}
							onChange={(e) => update("state", e.target.value)}
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={submitting}
					className="w-full rounded-full bg-[#D6FF4D] px-4 py-2.5 text-[13px] font-semibold text-[#1B1D14] transition hover:bg-[#c7f02f] disabled:opacity-60"
				>
					{submitting ? "Saving..." : needsOnboarding ? "Get started" : "Save changes"}
				</button>
			</form>
		</div>
	);
}