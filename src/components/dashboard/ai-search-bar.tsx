"use client";

import { useState, type FormEvent } from "react";
import { Mic, SendHorizonal } from "lucide-react";
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
			onSubmit={handleSubmit}
			className={cn(
				"flex items-center gap-2 rounded-full border border-black/5 bg-white/90 py-2 pl-5 pr-2 shadow-lg backdrop-blur-sm",
				className,
			)}
		>
			<input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
				className="flex-1 bg-transparent text-[13px] text-[#1D1E17] placeholder:text-[#9C9B8C] focus:outline-none"
			/>
			<button
				type="button"
				onClick={onVoiceClick}
				className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6B62] transition hover:bg-[#EFEEE4]"
				aria-label="Voice input"
			>
				<Mic className="h-4 w-4" strokeWidth={1.75} />
			</button>
			<button
				type="submit"
				className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D6FF4D] text-[#1B1D14] transition hover:bg-[#c7f02f]"
				aria-label="Send"
			>
				<SendHorizonal className="h-3.5 w-3.5" strokeWidth={2} />
			</button>
		</form>
	);
}