"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AdminGuard } from "@/components/admin/admin-guard";
import { cn } from "@/lib/utils";

const ROLES = ["farmer", "admin", "buyer"] as const;
type Role = (typeof ROLES)[number];

function UsersTable({ role }: { role: Role }) {
	const users = useQuery(api.users.queries.listByRole, { role });
	const setRole = useMutation(api.users.mutations.setRole);
	const setActive = useMutation(api.users.mutations.setActive);

	if (users === undefined) {
		return <div className="h-24 animate-pulse rounded-3xl bg-white/50" />;
	}

	if (users.length === 0) {
		return (
			<div className="rounded-3xl border border-black/5 bg-white/70 p-8 text-center text-[13px] text-[#8A8A7C]">
				No {role}s yet.
			</div>
		);
	}

	async function handleRoleChange(profileId: Id<"profiles">, newRole: Role) {
		try {
			await setRole({ profileId, role: newRole });
			toast.success("Role updated");
		} catch {
			toast.error("Couldn't update role");
		}
	}

	async function handleToggleActive(profileId: Id<"profiles">, isActive: boolean) {
		try {
			await setActive({ profileId, isActive: !isActive });
			toast.success(!isActive ? "Account reactivated" : "Account deactivated");
		} catch {
			toast.error("Couldn't update account status");
		}
	}

	return (
		<div className="flex flex-col gap-2">
			{users.map((u) => (
				<div
					key={u._id}
					className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 px-4 py-3"
				>
					<div>
						<p className="text-[13px] font-medium text-[#1D1E17]">{u.fullName}</p>
						<p className="text-[11px] text-[#8A8A7C]">
							{[u.village, u.district, u.state].filter(Boolean).join(", ") ||
								"No location set"}
						</p>
					</div>

					<div className="flex items-center gap-2">
						<select
							value={u.role}
							onChange={(e) => handleRoleChange(u._id, e.target.value as Role)}
							className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] text-[#1D1E17]"
						>
							{ROLES.map((r) => (
								<option key={r} value={r}>
									{r}
								</option>
							))}
						</select>

						<button
							type="button"
							onClick={() => handleToggleActive(u._id, u.isActive)}
							className={cn(
								"rounded-full px-3 py-1.5 text-[11px] font-medium",
								u.isActive
									? "bg-[#EEF6DD] text-[#5C7A2E]"
									: "bg-[#FBE7E4] text-[#B23A2B]",
							)}
						>
							{u.isActive ? "Active" : "Deactivated"}
						</button>
					</div>
				</div>
			))}
		</div>
	);
}

export default function AdminUsersPage() {
	const [role, setRole] = useState<Role>("farmer");

	return (
		<AdminGuard>
			<div className="flex flex-col gap-6">
				<AppTopbar
					title="Users"
					subtitle="Manage roles and account status"
					rightSlot={
						<div className="flex rounded-full bg-[#EFEEE4] p-1">
							{ROLES.map((r) => (
								<button
									key={r}
									type="button"
									onClick={() => setRole(r)}
									className={cn(
										"rounded-full px-3 py-1.5 text-[12px] font-medium capitalize transition",
										role === r
											? "bg-[#D6FF4D] text-[#1B1D14]"
											: "text-[#8A8A7C] hover:text-[#1D1E17]",
									)}
								>
									{r}s
								</button>
							))}
						</div>
					}
				/>
				<UsersTable role={role} />
			</div>
		</AdminGuard>
	);
}