"use client";

import { useEffect, useRef, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { AiSearchBar } from "./ai-search-bar";
import { cn } from "@/lib/utils";

export function AssistantPanel() {
	const messages = useQuery(api.assistant.queries.listMyMessages);
	const askAssistant = useAction(api.assistant.chat.askAssistant);
	const [pending, setPending] = useState(false);
	const [open, setOpen] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
	}, [messages, pending]);

	async function handleSubmit(query: string) {
		setOpen(true);
		setPending(true);
		try {
			await askAssistant({ message: query });
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Couldn't reach the assistant",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="fixed inset-x-0 bottom-6 mx-auto w-full max-w-md px-4">
			{open && (
				<div
					ref={scrollRef}
					className="mb-3 max-h-80 overflow-y-auto rounded-3xl border border-black/5 bg-white/95 p-4 shadow-lg backdrop-blur-sm"
				>
					{messages === undefined ? (
						<p className="text-center text-[12px] text-[#8A8A7C]">Loading...</p>
					) : messages.length === 0 ? (
						<p className="text-center text-[12px] text-[#8A8A7C]">
							Ask about your crops, weather advisories, or market prices.
						</p>
					) : (
						<div className="flex flex-col gap-2">
							{messages.map((m) => (
								<div
									key={m._id}
									className={cn(
										"max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug",
										m.role === "user"
											? "ml-auto bg-[#1D1E17] text-white"
											: "bg-[#EFEEE4] text-[#1D1E17]",
									)}
								>
									{m.content}
								</div>
							))}
							{pending && (
								<div className="max-w-[85%] rounded-2xl bg-[#EFEEE4] px-3 py-2 text-[13px] text-[#8A8A7C]">
									Thinking...
								</div>
							)}
						</div>
					)}
				</div>
			)}

			<AiSearchBar onSubmit={handleSubmit} />
		</div>
	);
}