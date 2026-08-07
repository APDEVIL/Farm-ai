"use node";

import { internal } from "../_generated/api";
import type { ActionCtx } from "../_generated/server";
import { internalAction } from "../_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;

type ForecastDay = {
	date: string;
	precipitationMm: number;
	tempMaxC: number;
	tempMinC: number;
};

async function fetchForecast(lat: number, lon: number): Promise<ForecastDay[]> {
	const url =
		`https://api.open-meteo.com/v1/forecast` +
		`?latitude=${lat}&longitude=${lon}` +
		`&daily=precipitation_sum,temperature_2m_max,temperature_2m_min` +
		`&forecast_days=3&timezone=auto`;

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Open-Meteo request failed: ${res.status}`);
	}
	const data = await res.json();

	const days: ForecastDay[] = data.daily.time.map(
		(date: string, i: number) => ({
			date,
			precipitationMm: data.daily.precipitation_sum[i],
			tempMaxC: data.daily.temperature_2m_max[i],
			tempMinC: data.daily.temperature_2m_min[i],
		}),
	);
	return days;
}

/** Simple, explainable threshold rules — easy for a client/admin to audit
 * and tune, unlike a black-box model. Extend this function as agronomy
 * requirements grow. */
function evaluateRules(district: string, days: ForecastDay[]) {
	const advisories: {
		title: string;
		body: string;
		severity: "info" | "warning" | "critical";
	}[] = [];

	const heavyRainDay = days.find((d) => d.precipitationMm >= 50);
	if (heavyRainDay) {
		advisories.push({
			title: "Heavy rainfall expected",
			body: `Heavy rainfall (${heavyRainDay.precipitationMm}mm) is forecast for ${heavyRainDay.date} in ${district}. Delay pesticide/fertilizer application and ensure field drainage is clear.`,
			severity: heavyRainDay.precipitationMm >= 100 ? "critical" : "warning",
		});
	}

	const frostDay = days.find((d) => d.tempMinC <= 4);
	if (frostDay) {
		advisories.push({
			title: "Frost risk",
			body: `Minimum temperature may drop to ${frostDay.tempMinC}°C on ${frostDay.date} in ${district}. Consider protective measures for frost-sensitive crops.`,
			severity: "warning",
		});
	}

	const heatwaveDay = days.find((d) => d.tempMaxC >= 42);
	if (heatwaveDay) {
		advisories.push({
			title: "Extreme heat expected",
			body: `Maximum temperature may reach ${heatwaveDay.tempMaxC}°C on ${heatwaveDay.date} in ${district}. Increase irrigation frequency and avoid midday fieldwork.`,
			severity: heatwaveDay.tempMaxC >= 45 ? "critical" : "warning",
		});
	}

	return advisories;
}

type FarmerRegion = {
	district: string;
	latitude: number;
	longitude: number;
};

/** Entry point called by crons.ts (or manually via the Convex dashboard).
 * Runs once, but internally loops over every distinct farmer region. */
export const syncWeatherAdvisories = internalAction({
	args: {},
	handler: async (
		ctx: ActionCtx,
	): Promise<{ regionsChecked: number; advisoriesCreated: number }> => {
		const regions: FarmerRegion[] = await ctx.runQuery(
			internal.users.queries.listDistinctFarmerRegions,
			{},
		);

		let created = 0;

		for (const region of regions) {
			let days: ForecastDay[];
			try {
				days = await fetchForecast(region.latitude, region.longitude);
			} catch (err) {
				console.error(`Weather fetch failed for ${region.district}:`, err);
				continue; // don't let one bad region abort the whole sync
			}

			const triggered = evaluateRules(region.district, days);

			for (const advisory of triggered) {
				const result = await ctx.runMutation(
					internal.advisory.mutations.insertSystemAdvisory,
					{
						title: advisory.title,
						body: advisory.body,
						severity: advisory.severity,
						region: region.district,
						validFrom: Date.now(),
						validUntil: Date.now() + 2 * DAY_MS,
					},
				);
				if (result) created++;
			}
		}

		console.log(`Weather sync done: ${created} advisories created`);
		return { regionsChecked: regions.length, advisoriesCreated: created };
	},
});
