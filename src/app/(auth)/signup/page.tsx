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

export default function SignupPage() {
	const router = useRouter();
	const { isAuthenticated } = useConvexAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [signedUp, setSignedUp] = useState(false);

	useEffect(() => {
		if (signedUp && isAuthenticated) {
			router.push("/profile");
		}
	}, [signedUp, isAuthenticated, router]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		setSubmitting(true);
		const { error } = await authClient.signUp.email({ name, email, password });

		if (error) {
			toast.error(error.message ?? "Couldn't create account");
			setSubmitting(false);
			return;
		}

		toast.success("Account created");
		setSignedUp(true);
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
						Create your account
					</h1>
					<p className="mt-1 text-[13px] text-[#8A8A7C]">
						Get advisories and market prices tailored to your farm.
					</p>

					<form onSubmit={handleSubmit} className="mt-6 space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="signup-name">Full name</Label>
							<Input
								id="signup-name"
								autoComplete="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="signup-email">Email</Label>
							<Input
								id="signup-email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="signup-password">Password</Label>
							<Input
								id="signup-password"
								type="password"
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<p className="text-[11px] text-[#8A8A7C]">At least 8 characters</p>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-full bg-[#D6FF4D] px-4 py-2.5 text-[13px] font-semibold text-[#1B1D14] transition hover:bg-[#c7f02f] disabled:opacity-60"
						>
							{submitting ? "Creating account..." : "Create account"}
						</button>
					</form>
				</div>

				<p className="mt-4 text-center text-[13px] text-[#8A8A7C]">
					Already have an account?{" "}
					<Link href="/login" className="font-medium text-[#1D1E17] underline">
						Log in
					</Link>
				</p>
			</div>
		</main>
	);
}