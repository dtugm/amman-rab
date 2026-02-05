import rabData from "./data/rab.json";
import { RabRow } from "./components/RabRow";
import { BudgetSummary } from "./components/BudgetSummary";
import type { RabItem } from "./types/rab";
import { formatCurrency } from "./utils/format";

function App() {
  const data = rabData as RabItem[];

  // Calculate Grand Total
  // Assuming root items contain the subtotals or we sum them up?
  // Usually RAB usually has totals at the bottom or top.
  // We can just sum the top-level items if they represent the parts.
  // Calculate Base Total (Sum of Phase I, II, PoC etc)
  const baseTotal = data.reduce((sum, item) => {
    return sum + (typeof item.totalPrice === "number" ? item.totalPrice : 0);
  }, 0);

  // Apply Tax Logic to get Grand Total
  // Total -> * 1.11 (DPP) -> * 1.11 (Grand Total)
  const dpp = Math.round(baseTotal * 1.11);
  const finalGrandTotal = Math.round(dpp * 1.11);

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-tertiary to-secondary" />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            RAB Viewer
          </h1>
          <p className="text-lg md:text-xl text-blue-200 font-light">
            Project: Amman Geodesi 2026
          </p>

          <div className="mt-6 md:mt-0 md:absolute md:top-8 md:right-8">
            <div className="md:text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
              <p className="text-sm text-gray-300 uppercase tracking-widest mb-0 md:mb-1">
                Total Budget
              </p>
              <p className="text-2xl md:text-3xl font-mono font-bold text-white">
                {finalGrandTotal ? formatCurrency(finalGrandTotal) : "Estimasi"}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Summary Table */}
        <BudgetSummary
          pocTotal={data[0]?.totalPrice || 0}
          phase1Total={data[1]?.totalPrice || 0}
          phase2Total={data[2]?.totalPrice || 0}
        />

        {/* Table Container - Modified for neatness: max-height instead of fixed height */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
          {/* Scrollable Area - Handles both horizontal and vertical scroll */}
          <div className="overflow-auto flex-1 custom-scrollbar">
            <div className="min-w-[1024px] inline-block align-middle w-full">
              {/* Table Header */}
              <div className="sticky top-0 z-20 grid-cols-rab grid gap-4 py-4 px-4 bg-[#1a1f3c] border-b border-white/10 text-xs uppercase tracking-wider font-bold text-white/70 backdrop-blur-xl shadow-lg">
                <div className="pl-12">ITEM</div>
                <div className="text-center">QTY</div>
                <div className="text-center">JAM</div>
                <div className="text-center">HARI</div>
                <div className="text-center">BULAN</div>
                <div className="text-center">VOLUME</div>
                <div className="text-center">SATUAN</div>
                <div className="text-right">TOTAL</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {data.map((item) => (
                  <RabRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer / Grand Total (Fixed at bottom) */}
          <div className="p-4 bg-white/5 border-t border-white/20 z-20 relative">
            <div className="flex justify-end items-center text-white">
              <span className="mr-8 font-light italic opacity-60">
                End of Report
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
