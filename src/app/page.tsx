import { CloudSun, Sprout, Store } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
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
					<span className="font-semibold text-[#1D1E17] text-[15px]">
						AgriAdvisor
					</span>
				</div>
				<div className="flex items-center gap-3">
					<Link
						className="font-medium text-[#4C4C42] text-[13px] transition hover:text-[#1D1E17]"
						href="/login"
					>
						Log in
					</Link>
					<Link
						className="rounded-full bg-[#D6FF4D] px-4 py-2 font-semibold text-[#1B1D14] text-[13px] transition hover:bg-[#c7f02f]"
						href="/signup"
					>
						Get started
					</Link>
				</div>
			</header>

			<section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
				<span className="rounded-full bg-white/70 px-3 py-1 font-medium text-[#6B6B62] text-[11px]">
					Built for farmers
				</span>
				<h1 className="mt-4 max-w-2xl font-semibold text-4xl text-[#1D1E17] tracking-tight sm:text-5xl">
					Crop advisory and market prices, in one place
				</h1>
				<p className="mt-4 max-w-md text-[#6B6B62] text-[15px]">
					Weather-triggered advisories, live mandi prices, and simple crop
					tracking — built to help you make better decisions, faster.
				</p>
				<Link
					className="mt-8 rounded-full bg-[#1D1E17] px-6 py-3 font-semibold text-[14px] text-white transition hover:bg-[#2A2B22]"
					href="/signup"
				>
					Create your account
				</Link>

				<div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
					<FeatureCard
						description="Automatic alerts for rain, frost, and heat before they hit your fields."
						icon={CloudSun}
						title="Weather advisories"
					/>
					<FeatureCard
						description="Daily mandi prices synced from government sources, plus local records."
						icon={Store}
						title="Market prices"
					/>
					<FeatureCard
						description="Log what you've planted and follow it from sowing to harvest."
						icon={Sprout}
						title="Crop tracking"
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
			<h3 className="mt-3 font-semibold text-[#1D1E17] text-[14px]">{title}</h3>
			<p className="mt-1 text-[#8A8A7C] text-[12px]">{description}</p>
		</div>
	);
}
