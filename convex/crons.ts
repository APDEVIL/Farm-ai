import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Weather can change fast — check twice a day.
crons.interval(
	"sync weather advisories",
	{ hours: 12 },
	internal.advisory.weather.syncWeatherAdvisories,
	{},
);

// Agmarknet publishes daily, so once a day (early morning) is enough.
crons.cron(
	"sync agmarknet prices",
	"30 2 * * *", // 02:30 UTC daily — adjust to your timezone needs
	internal.market.agmarknet.syncAgmarknetPrices,
	{},
);

export default crons;
