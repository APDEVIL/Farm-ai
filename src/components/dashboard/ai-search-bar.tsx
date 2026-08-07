"use client";

import { Mic, SendHorizonal } from "lucide-react";
import { type FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

interface AiSearchBarProps {
	placeholder?: string;
	onSubmit?: (query: string) => void;
	onVoiceClick?: () => void;
	className?: string;
}

/** The floating "How can I help you?" input from the reference dashboard.
 * Purely presentational until you wire it to an actual assistant/search
 * backend — see the note in our conversation about confirming that scope. */
export function AiSearchBar({
	placeholder = "How can I help you?",
	onSubmit,
	onVoiceClick,
	className,
}: AiSearchBarProps) {
	const [value, setValue] = useState("");

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!value.trim()) return;
		onSubmit?.(value.trim());
		setValue("");
	}

	return (
		<form
			className={cn(
				"flex items-center gap-2 rounded-full border border-black/5 bg-white/90 py-2 pr-2 pl-5 shadow-lg backdrop-blur-sm",
				className,
			)}
			onSubmit={handleSubmit}
		>
			<input
				className="flex-1 bg-transparent text-[#1D1E17] text-[13px] placeholder:text-[#9C9B8C] focus:outline-none"
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
				value={value}
			/>
			<button
				aria-label="Voice input"
				className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6B62] transition hover:bg-[#EFEEE4]"
				onClick={onVoiceClick}
				type="button"
			>
				<Mic className="h-4 w-4" strokeWidth={1.75} />
			</button>
			<button
				aria-label="Send"
				className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D6FF4D] text-[#1B1D14] transition hover:bg-[#c7f02f]"
				type="submit"
			>
				<SendHorizonal className="h-3.5 w-3.5" strokeWidth={2} />
			</button>
		</form>
	);
}
