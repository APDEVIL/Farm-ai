import Link from "next/link";
import { redirect } from "next/navigation";
import { Sprout, CloudSun, Store } from "lucide-react";
import { getSession } from "@/server/better-auth/server";

export default async function HomePage() {
	const session = await getSession();
	if (session) {
		redirect("/dashboard");
	}

	return (
		<main className="flex min-h-screen flex-col bg-[#EDEBDF]">
			<header className="flex items-center justify-between px-8 py-6">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D1E17]">
						<Sprout className="h-4 w-4 text-[#D6FF4D]" strokeWidth={2} />
					</div>
					<span className="text-[15px] font-semibold text-[#1D1E17]">
						AgriAdvisor
					</span>
				</div>
				<div className="flex items-center gap-3">
					<Link
						href="/login"
						className="text-[13px] font-medium text-[#4C4C42] transition hover:text-[#1D1E17]"
					>
						Log in
					</Link>
					<Link
						href="/signup"
						className="rounded-full bg-[#D6FF4D] px-4 py-2 text-[13px] font-semibold text-[#1B1D14] transition hover:bg-[#c7f02f]"
					>
						Get started
					</Link>
				</div>
			</header>

			<section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
				<span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-[#6B6B62]">
					Built for farmers
				</span>
				<h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#1D1E17] sm:text-5xl">
					Crop advisory and market prices, in one place
				</h1>
				<p className="mt-4 max-w-md text-[15px] text-[#6B6B62]">
					Weather-triggered advisories, live mandi prices, and simple crop
					tracking — built to help you make better decisions, faster.
				</p>
				<Link
					href="/signup"
					className="mt-8 rounded-full bg-[#1D1E17] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#2A2B22]"
				>
					Create your account
				</Link>

				<div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
					<FeatureCard
						icon={CloudSun}
						title="Weather advisories"
						description="Automatic alerts for rain, frost, and heat before they hit your fields."
					/>
					<FeatureCard
						icon={Store}
						title="Market prices"
						description="Daily mandi prices synced from government sources, plus local records."
					/>
					<FeatureCard
						icon={Sprout}
						title="Crop tracking"
						description="Log what you've planted and follow it from sowing to harvest."
					/>
				</div>
			</section>
		</main>
	);
}

function FeatureCard({
	icon: Icon,
	title,
	description,
}: {
	icon: typeof Sprout;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-3xl border border-black/5 bg-white/70 p-5 text-left backdrop-blur-sm">
			<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF3DE]">
				<Icon className="h-4 w-4 text-[#3F4A2B]" strokeWidth={1.75} />
			</div>
			<h3 className="mt-3 text-[14px] font-semibold text-[#1D1E17]">{title}</h3>
			<p className="mt-1 text-[12px] text-[#8A8A7C]">{description}</p>
		</div>
	);
}