import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/lib/convex-client-provider";
import "./globals.css";

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist",
});

export const metadata: Metadata = {
	title: "AgriAdvisor — Crop Advisory & Market Prices",
	description:
		"Crop advisory and market price tracking for farmers — weather-based alerts, mandi prices, and farm management in one place.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html className={geist.variable} lang="en">
			<body className="font-sans antialiased">
				<ConvexClientProvider>
					{children}
					<Toaster position="top-right" richColors />
				</ConvexClientProvider>
			</body>
		</html>
	);
}
