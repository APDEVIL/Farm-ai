"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppTopbar } from "@/components/layout/app-topbar";
import { PriceTable } from "@/components/market/price-table";
import { PriceHistoryChart } from "@/components/market/price-history-chart";
import { Input } from "@/components/ui/input";

function daysAgoIso(days: number) {
	const d = new Date();
	d.setDate(d.getDate() - days);
	return d.toISOString().slice(0, 10);
}

export default function MarketPage() {
	const [commodity, setCommodity] = useState("Wheat");
	const [searchInput, setSearchInput] = useState("Wheat");

	const latest = useQuery(api.market.queries.getLatestPrices, { commodity });
	const history = useQuery(api.market.queries.getPriceHistory, {
		commodity,
		fromDate: daysAgoIso(30),
		toDate: daysAgoIso(0),
	});

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		setCommodity(searchInput.trim());
	}

	return (
		<div className="flex flex-col gap-6">
			<AppTopbar
				title="Market Prices"
				subtitle="Latest mandi prices synced from Agmarknet"
				rightSlot={
					<form onSubmit={handleSearch} className="flex gap-2">
						<Input
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder="Search commodity..."
							className="w-44"
						/>
					</form>
				}
			/>

			{history === undefined ? (
				<div className="h-56 animate-pulse rounded-3xl bg-white/50" />
			) : (
				<PriceHistoryChart commodity={commodity} data={history} />
			)}

			{latest === undefined ? (
				<div className="h-40 animate-pulse rounded-3xl bg-white/50" />
			) : (
				<PriceTable prices={latest} />
			)}
		</div>
	);
}