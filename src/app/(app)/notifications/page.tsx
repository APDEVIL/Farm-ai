"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AdvisoryList } from "@/components/advisory/advisory-list";

/** There's no separate "notifications" table in the schema — the only
 * notification-shaped data we actually have is unread advisories, so this
 * page is that feed. If you later add other notification types (e.g.
 * price-drop alerts, upload review status), this is where they'd merge in. */
export default function NotificationsPage() {
	const unread = useQuery(api.advisory.queries.listUnread);

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				title="Notifications"
				subtitle="Advisories that need your attention"
			/>

			{unread === undefined ? (
				<div className="flex flex-col gap-3">
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className="h-24 animate-pulse rounded-3xl bg-white/50" />
					))}
				</div>
			) : (
				<AdvisoryList advisories={unread} interactive />
			)}
		</div>
	);
}