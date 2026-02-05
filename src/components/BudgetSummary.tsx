import React, { useState } from "react";
import { formatCurrency } from "../utils/format";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

interface BudgetSummaryProps {
  pocTotal: number;
  phase1Total: number;
  phase2Total: number;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  pocTotal,
  phase1Total,
  phase2Total,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default as per standard "collapsible" request implies optionality

  const total = pocTotal + phase1Total + phase2Total;
  const dpp = Math.round(total * 1.11);
  const grandTotal = Math.round(dpp * 1.11);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl mb-8 shadow-2xl overflow-hidden">
      {/* Header / Clickable Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
          Budget Summary
        </h2>
        {!isOpen && (
          <span className="text-sm font-mono text-blue-200 bg-white/10 px-3 py-1 rounded-full">
            {formatCurrency(grandTotal)}
          </span>
        )}
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 pt-0 md:p-6 md:pt-0 overflow-x-auto">
              <table className="w-full text-sm text-left text-white/90">
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium">PoC</td>
                    <td className="py-3 px-4 text-right font-mono text-white/80">
                      {formatCurrency(pocTotal)}
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium">Phase I</td>
                    <td className="py-3 px-4 text-right font-mono text-white/80">
                      {formatCurrency(phase1Total)}
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium">Phase II</td>
                    <td className="py-3 px-4 text-right font-mono text-white/80">
                      {formatCurrency(phase2Total)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-white/20 bg-white/5 font-bold">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4 text-right font-mono text-white">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-white/5">
                    <td className="py-3 px-4 font-medium">DPP</td>
                    <td className="py-3 px-4 text-right font-mono text-white">
                      {formatCurrency(dpp)}
                    </td>
                  </tr>
                  <tr className="bg-primary/20 text-white font-bold text-lg">
                    <td className="py-4 px-4">DPP + Ppn 11%</td>
                    <td className="py-4 px-4 text-right font-mono text-blue-200">
                      {formatCurrency(grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
