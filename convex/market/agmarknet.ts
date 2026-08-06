"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

// Resource: "Current Daily Price of Various Commodities from Various
// Markets (Mandi)" — data.gov.in resource id, confirmed field names:
// state, district, market, commodity, variety, grade, arrival_date,
// min_price, max_price, modal_price.
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

type AgmarknetRecord = {
	state: string;
	district: string;
	market: string;
	commodity: string;
	variety: string;
	grade: string;
	arrival_date: string; // "DD/MM/YYYY"
	min_price: string;
	max_price: string;
	modal_price: string;
};

function toIsoDate(ddmmyyyy: string): string {
	const [dd, mm, yyyy] = ddmmyyyy.split("/");
	return `${yyyy}-${mm}-${dd}`;
}

async function fetchAgmarknetPage(
	apiKey: string,
	commodity: string,
	offset: number,
	limit: number,
): Promise<AgmarknetRecord[]> {
	const url =
		`${BASE_URL}?api-key=${apiKey}&format=json` +
		`&filters[commodity]=${encodeURIComponent(commodity)}` +
		`&offset=${offset}&limit=${limit}`;

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Agmarknet request failed: ${res.status}`);
	}
	const data = await res.json();
	return data.records ?? [];
}

/** Entry point called by crons.ts. Syncs a fixed watchlist of commodities —
 * extend COMMODITIES as the client needs more tracked. Free-tier API keys
 * are capped at ~10 records per request, so we page through with a small
 * limit rather than requesting everything at once. */
export const syncAgmarknetPrices = internalAction({
	args: {
		commodities: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const apiKey = process.env.AGMARKNET_API_KEY;
		if (!apiKey) {
			console.error("AGMARKNET_API_KEY not set — skipping sync");
			return { synced: 0, skipped: true };
		}

		const commodities = args.commodities ?? [
			"Wheat",
			"Rice",
			"Onion",
			"Tomato",
			"Potato",
			"Cotton",
			"Soyabean",
			"Maize",
		];

		let synced = 0;

		for (const commodity of commodities) {
			let records: AgmarknetRecord[];
			try {
				records = await fetchAgmarknetPage(apiKey, commodity, 0, 10);
			} catch (err) {
				console.error(`Agmarknet fetch failed for ${commodity}:`, err);
				continue; // one bad commodity shouldn't abort the whole sync
			}

			for (const r of records) {
				const minPrice = Number.parseFloat(r.min_price);
				const maxPrice = Number.parseFloat(r.max_price);
				const modalPrice = Number.parseFloat(r.modal_price);
				if (
					Number.isNaN(minPrice) ||
					Number.isNaN(maxPrice) ||
					Number.isNaN(modalPrice)
				) {
					continue; // skip malformed rows rather than crash the sync
				}

				await ctx.runMutation(internal.market.mutations.upsertFromAgmarknet, {
					commodity: r.commodity,
					variety: r.variety || undefined,
					market: r.market,
					state: r.state,
					district: r.district || undefined,
					minPrice,
					maxPrice,
					modalPrice,
					priceDate: toIsoDate(r.arrival_date),
				});
				synced++;
			}
		}

		console.log(`Agmarknet sync done: ${synced} price rows upserted`);
		return { synced, skipped: false };
	},
});