import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MarketPriceRow {
	_id: string;
	commodity: string;
	variety?: string;
	market: string;
	state: string;
	district?: string;
	minPrice: number;
	maxPrice: number;
	modalPrice: number;
	priceDate: string;
	source: "agmarknet" | "manual";
}

interface PriceTableProps {
	prices: MarketPriceRow[];
	className?: string;
}

/** Table of mandi prices. Presentational — fetch via
 * `useQuery(api.market.queries.getLatestPrices, { commodity })` (or
 * `listByState`) in the page and pass the result in as `prices`. */
export function PriceTable({ prices, className }: PriceTableProps) {
	if (prices.length === 0) {
		return (
			<div className="rounded-3xl border border-black/5 bg-white/70 p-8 text-center text-[#8A8A7C] text-[13px]">
				No prices recorded yet for this selection.
			</div>
		);
	}

	return (
		<div className={cn("overflow-hidden rounded-3xl border border-black/5 bg-white/70", className)}>
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead>Commodity</TableHead>
						<TableHead>Market</TableHead>
						<TableHead>State</TableHead>
						<TableHead className="text-right">Min</TableHead>
						<TableHead className="text-right">Max</TableHead>
						<TableHead className="text-right">Modal</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Source</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{prices.map((row) => (
						<TableRow key={row._id}>
							<TableCell className="font-medium text-[#1D1E17]">
								{row.commodity}
								{row.variety && (
									<span className="ml-1 text-[11px] text-[#8A8A7C]">
										({row.variety})
									</span>
								)}
							</TableCell>
							<TableCell className="text-[#4C4C42]">{row.market}</TableCell>
							<TableCell className="text-[#4C4C42]">{row.state}</TableCell>
							<TableCell className="text-right text-[#4C4C42]">
								₹{row.minPrice.toLocaleString("en-IN")}
							</TableCell>
							<TableCell className="text-right text-[#4C4C42]">
								₹{row.maxPrice.toLocaleString("en-IN")}
							</TableCell>
							<TableCell className="text-right font-semibold text-[#1D1E17]">
								₹{row.modalPrice.toLocaleString("en-IN")}
							</TableCell>
							<TableCell className="text-[#8A8A7C]">{row.priceDate}</TableCell>
							<TableCell>
								<Badge
									variant="outline"
									className={cn(
										"text-[10px] capitalize",
										row.source === "agmarknet"
											? "border-[#8FA857] text-[#5C7A2E]"
											: "border-[#B7B6A8] text-[#6B6B62]",
									)}
								>
									{row.source}
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}