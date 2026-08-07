"use client";

import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AppTopbar } from "@/components/layout/app-topbar";
import { PriceTable } from "@/components/market/price-table";
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
import { api } from "../../../../../convex/_generated/api";

function todayIso() {
	return new Date().toISOString().slice(0, 10);
}

function RecordPriceDialog() {
	const recordPrice = useMutation(api.market.mutations.recordPrice);
	const [open, setOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		commodity: "",
		variety: "",
		market: "",
		state: "",
		district: "",
		minPrice: "",
		maxPrice: "",
		modalPrice: "",
		priceDate: todayIso(),
	});

	function update<K extends keyof typeof form>(key: K, value: string) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const {
			commodity,
			market,
			state,
			minPrice,
			maxPrice,
			modalPrice,
			priceDate,
		} = form;
		if (
			!commodity ||
			!market ||
			!state ||
			!minPrice ||
			!maxPrice ||
			!modalPrice
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		setSubmitting(true);
		try {
			await recordPrice({
				commodity,
				variety: form.variety || undefined,
				market,
				state,
				district: form.district || undefined,
				minPrice: Number(minPrice),
				maxPrice: Number(maxPrice),
				modalPrice: Number(modalPrice),
				priceDate,
			});
			toast.success("Price recorded");
			setForm({
				commodity: "",
				variety: "",
				market: "",
				state: "",
				district: "",
				minPrice: "",
				maxPrice: "",
				modalPrice: "",
				priceDate: todayIso(),
			});
			setOpen(false);
		} catch {
			toast.error("Couldn't record price");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger className="flex items-center gap-1.5 rounded-full bg-[#D6FF4D] px-4 py-2 font-semibold text-[#1B1D14] text-[12px] transition hover:bg-[#c7f02f]">
				<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
				Record price
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Manually record a price</DialogTitle>
				</DialogHeader>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="mp-commodity">Commodity</Label>
							<Input
								id="mp-commodity"
								onChange={(e) => update("commodity", e.target.value)}
								placeholder="e.g. Wheat"
								required
								value={form.commodity}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="mp-variety">Variety</Label>
							<Input
								id="mp-variety"
								onChange={(e) => update("variety", e.target.value)}
								value={form.variety}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="mp-market">Market (mandi)</Label>
							<Input
								id="mp-market"
								onChange={(e) => update("market", e.target.value)}
								required
								value={form.market}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="mp-state">State</Label>
							<Input
								id="mp-state"
								onChange={(e) => update("state", e.target.value)}
								required
								value={form.state}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="mp-district">District</Label>
						<Input
							id="mp-district"
							onChange={(e) => update("district", e.target.value)}
							value={form.district}
						/>
					</div>

					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="mp-min">Min ₹</Label>
							<Input
								id="mp-min"
								onChange={(e) => update("minPrice", e.target.value)}
								required
								type="number"
								value={form.minPrice}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="mp-max">Max ₹</Label>
							<Input
								id="mp-max"
								onChange={(e) => update("maxPrice", e.target.value)}
								required
								type="number"
								value={form.maxPrice}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="mp-modal">Modal ₹</Label>
							<Input
								id="mp-modal"
								onChange={(e) => update("modalPrice", e.target.value)}
								required
								type="number"
								value={form.modalPrice}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="mp-date">Price date</Label>
						<Input
							id="mp-date"
							onChange={(e) => update("priceDate", e.target.value)}
							required
							type="date"
							value={form.priceDate}
						/>
					</div>

					<DialogFooter>
						<button
							className="w-full rounded-full bg-[#D6FF4D] px-4 py-2.5 font-semibold text-[#1B1D14] text-[13px] transition hover:bg-[#c7f02f] disabled:opacity-60"
							disabled={submitting}
							type="submit"
						>
							{submitting ? "Saving..." : "Record price"}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminMarketPricesPage() {
	const prices = useQuery(api.market.queries.listRecent);

	return (
		<AdminGuard>
			<div className="flex flex-col gap-6">
				<AppTopbar
					rightSlot={<RecordPriceDialog />}
					subtitle="Recent prices — synced from Agmarknet or entered manually"
					title="Market Prices"
				/>

				{prices === undefined ? (
					<div className="h-24 animate-pulse rounded-3xl bg-white/50" />
				) : (
					<PriceTable prices={prices} />
				)}
			</div>
		</AdminGuard>
	);
}
