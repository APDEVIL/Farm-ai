import { v } from "convex/values";

export const cropStatus = v.union(
	v.literal("planned"),
	v.literal("growing"),
	v.literal("harvested"),
);

export const advisorySeverity = v.union(
	v.literal("info"),
	v.literal("warning"),
	v.literal("critical"),
);

export const uploadCategory = v.union(
	v.literal("crop_image"),
	v.literal("certificate"),
	v.literal("id_proof"),
	v.literal("other"),
);