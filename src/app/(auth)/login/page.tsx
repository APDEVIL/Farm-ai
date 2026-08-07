"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";
import { Sprout } from "lucide-react";
import { authClient } from "@/server/better-auth/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
	const router = useRouter();
	const { isAuthenticated } = useConvexAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [signedIn, setSignedIn] = useState(false);

	// Don't navigate the instant signIn resolves — Convex's own auth state
	// (which AuthGate depends on) takes a moment to sync afterward. Navigate
	// only once Convex itself confirms the session, avoiding a redirect
	// back to /login caused by AuthGate seeing a stale "not authenticated".
	useEffect(() => {
		if (signedIn && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [signedIn, isAuthenticated, router]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);

		const { error } = await authClient.signIn.email({ email, password });

		if (error) {
			toast.error(error.message ?? "Couldn't sign in");
			setSubmitting(false);
			return;
		}

		toast.success("Welcome back");
		setSignedIn(true);
		// Deliberately not setSubmitting(false) here — button stays disabled
		// showing "Logging in..." until the effect above actually navigates.
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#EDEBDF] px-4">
			<div className="w-full max-w-sm">
				<div className="mb-8 flex items-center justify-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D1E17]">
						<Sprout className="h-4 w-4 text-[#D6FF4D]" strokeWidth={2} />
					</div>
					<span className="text-[16px] font-semibold text-[#1D1E17]">
						AgriAdvisor
					</span>
				</div>

				<div className="rounded-3xl border border-black/5 bg-white/70 p-6 backdrop-blur-sm">
					<h1 className="text-[18px] font-semibold text-[#1D1E17]">
						Log in to your account
					</h1>
					<p className="mt-1 text-[13px] text-[#8A8A7C]">
						Welcome back — enter your details below.
					</p>

					<form onSubmit={handleSubmit} className="mt-6 space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="login-email">Email</Label>
							<Input
								id="login-email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="login-password">Password</Label>
							<Input
								id="login-password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-full bg-[#D6FF4D] px-4 py-2.5 text-[13px] font-semibold text-[#1B1D14] transition hover:bg-[#c7f02f] disabled:opacity-60"
						>
							{submitting ? "Logging in..." : "Log in"}
						</button>
					</form>
				</div>

				<p className="mt-4 text-center text-[13px] text-[#8A8A7C]">
					Don't have an account?{" "}
					<Link href="/signup" className="font-medium text-[#1D1E17] underline">
						Sign up
					</Link>
				</p>
			</div>
		</main>
	);
}