"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";

const GROQ_MODEL = "llama-3.3-70b-versatile";

function buildSystemPrompt(
	profile: { fullName: string; district?: string; state?: string },
	crops: { name: string; status: string }[],
	advisories: { title: string; severity: string }[],
): string {
	const cropList =
		crops.length > 0
			? crops.map((c) => `${c.name} (${c.status})`).join(", ")
			: "no crops logged yet";

	const advisoryList =
		advisories.length > 0
			? advisories.map((a) => `[${a.severity}] ${a.title}`).join("; ")
			: "no active advisories";

	return `You are a helpful farm advisory assistant inside AgriAdvisor, an app for crop advisory and market prices. You are talking to ${profile.fullName}, a farmer${profile.district ? ` in ${profile.district}, ${profile.state ?? ""}` : ""}.

Their current crops: ${cropList}.
Their unread advisories: ${advisoryList}.

Answer practically and concisely (2-4 sentences unless asked for detail). If asked about something outside farming/crops/market prices/this app, gently redirect. If you don't have enough information to answer well, say so rather than guessing specifics like exact dosages or prices.`;
}

export const askAssistant = action({
	args: { message: v.string() },
	handler: async (ctx, { message }): Promise<string> => {
		const profile = await ctx.runQuery(api.users.queries.getMyProfile, {});
		if (!profile) {
			throw new Error("Complete your profile before using the assistant");
		}

		// Pull recent history BEFORE saving the new message, so we don't
		// double-count it when building the conversation for Groq.
		const history = await ctx.runQuery(api.assistant.queries.listMyMessages, {});
		const recentHistory = history.slice(-10).map((m) => ({
			role: m.role,
			content: m.content,
		}));

		const [crops, advisories] = await Promise.all([
			ctx.runQuery(api.crops.queries.listMyCrops, {}),
			ctx.runQuery(api.advisory.queries.listUnread, {}),
		]);

		await ctx.runMutation(internal.assistant.mutations.saveMessage, {
			farmerId: profile._id,
			role: "user",
			content: message,
		});

		const apiKey = process.env.GROQ_API_KEY;
		if (!apiKey) {
			throw new Error("GROQ_API_KEY not set on this Convex deployment");
		}

		const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: GROQ_MODEL,
				messages: [
					{ role: "system", content: buildSystemPrompt(profile, crops, advisories) },
					...recentHistory,
					{ role: "user", content: message },
				],
				temperature: 0.4,
				max_tokens: 500,
			}),
		});

		if (!res.ok) {
			const errText = await res.text();
			console.error(`Groq request failed: ${res.status} ${errText}`);
			throw new Error("The assistant is temporarily unavailable");
		}

		const data = await res.json();
		const reply: string =
			data.choices?.[0]?.message?.content ??
			"Sorry, I couldn't generate a response.";

		await ctx.runMutation(internal.assistant.mutations.saveMessage, {
			farmerId: profile._id,
			role: "assistant",
			content: reply,
		});

		return reply;
	},
});