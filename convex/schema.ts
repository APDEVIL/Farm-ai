import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// NOTE: Better Auth's own tables (user, session, account, verification) are
// injected automatically by the @convex-dev/better-auth component via
// convex.config.ts — do NOT redefine them here. We only extend the "user"
// concept with app-specific fields through a separate `profiles` table
// keyed by the Better Auth user id, so we never fight the component's schema.

export default defineSchema({
	// ---------------------------------------------------------------------
	// App-level profile, 1:1 with a Better Auth user. Holds role + farm info.
	// ---------------------------------------------------------------------
	profiles: defineTable({
		authUserId: v.string(), // Better Auth user _id (string form)
		role: v.union(
			v.literal("farmer"),
			v.literal("admin"),
			v.literal("buyer"),
		),
		fullName: v.string(),
		phone: v.optional(v.string()),
		village: v.optional(v.string()),
		district: v.optional(v.string()),
		state: v.optional(v.string()),
		latitude: v.optional(v.number()),
		longitude: v.optional(v.number()),
		isActive: v.boolean(),
	})
		.index("by_authUserId", ["authUserId"])
		.index("by_role", ["role"]),

	// ---------------------------------------------------------------------
	// Crops a farmer is currently growing / has grown
	// ---------------------------------------------------------------------
	crops: defineTable({
		farmerId: v.id("profiles"),
		name: v.string(), // e.g. "Wheat", "Cotton"
		variety: v.optional(v.string()),
		areaAcres: v.optional(v.number()),
		sownDate: v.optional(v.number()), // epoch ms
		expectedHarvestDate: v.optional(v.number()),
		status: v.union(
			v.literal("planned"),
			v.literal("growing"),
			v.literal("harvested"),
		),
		notes: v.optional(v.string()),
	})
		.index("by_farmer", ["farmerId"])
		.index("by_farmer_status", ["farmerId", "status"]),

	// ---------------------------------------------------------------------
	// Advisory content — can be static (admin-authored) or system-generated
	// (e.g. triggered by a weather condition for a crop/region)
	// ---------------------------------------------------------------------
	advisories: defineTable({
		title: v.string(),
		body: v.string(),
		cropName: v.optional(v.string()), // null = general advisory
		severity: v.union(
			v.literal("info"),
			v.literal("warning"),
			v.literal("critical"),
		),
		source: v.union(v.literal("admin"), v.literal("system")),
		region: v.optional(v.string()), // district/state this applies to
		createdBy: v.optional(v.id("profiles")), // admin author, if manual
		validFrom: v.number(),
		validUntil: v.optional(v.number()),
	})
		.index("by_region", ["region"])
		.index("by_cropName", ["cropName"]),

	// Per-farmer read/dismiss state for advisories (many-to-many)
	advisoryReceipts: defineTable({
		farmerId: v.id("profiles"),
		advisoryId: v.id("advisories"),
		readAt: v.optional(v.number()),
		dismissedAt: v.optional(v.number()),
	})
		.index("by_farmer", ["farmerId"])
		.index("by_farmer_advisory", ["farmerId", "advisoryId"]),

	// ---------------------------------------------------------------------
	// Market prices — synced from Agmarknet (data.gov.in) or manually seeded
	// ---------------------------------------------------------------------
	marketPrices: defineTable({
		commodity: v.string(),
		variety: v.optional(v.string()),
		market: v.string(), // mandi name
		state: v.string(),
		district: v.optional(v.string()),
		minPrice: v.number(), // per quintal, matches Agmarknet units
		maxPrice: v.number(),
		modalPrice: v.number(),
		priceDate: v.string(), // "YYYY-MM-DD" — matches source granularity
		source: v.union(v.literal("agmarknet"), v.literal("manual")),
		enteredBy: v.optional(v.id("profiles")), // admin, if manual
	})
		.index("by_commodity_date", ["commodity", "priceDate"])
		.index("by_state_commodity", ["state", "commodity"]),

	// ---------------------------------------------------------------------
	// Files (crop images, certificates, ID proofs) uploaded via Uploadthing
	// ---------------------------------------------------------------------
	uploads: defineTable({
		ownerId: v.id("profiles"),
		uploadthingKey: v.string(),
		url: v.string(),
		fileName: v.string(),
		fileType: v.string(), // mime type
		category: v.union(
			v.literal("crop_image"),
			v.literal("certificate"),
			v.literal("id_proof"),
			v.literal("other"),
		),
		relatedCropId: v.optional(v.id("crops")),
	})
		.index("by_owner", ["ownerId"])
		.index("by_owner_category", ["ownerId", "category"]),

	// ---------------------------------------------------------------------
	// AI assistant chat history — persisted per farmer, Groq-backed
	// ---------------------------------------------------------------------
	assistantMessages: defineTable({
		farmerId: v.id("profiles"),
		role: v.union(v.literal("user"), v.literal("assistant")),
		content: v.string(),
	}).index("by_farmer", ["farmerId"]),
});