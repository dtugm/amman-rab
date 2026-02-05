import React, { useState } from "react";
import type { RabItem } from "../types/rab";
import { formatCurrency } from "../utils/format";
import { ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface RabRowProps {
  item: RabItem;
  depth?: number;
}

export const RabRow: React.FC<RabRowProps> = ({ item, depth = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(false); // Default collapsed

  const toggle = () => setIsOpen(!isOpen);

  // Indentation calculation
  const paddingLeft = `${depth * 1.5 + 1}rem`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "grid-cols-rab grid gap-4 py-3 px-4 border-b border-white/10 items-center transition-colors duration-200",
          "hover:bg-white/10",
          depth === 0
            ? "bg-white/10 font-bold text-lg text-white"
            : "text-gray-100",
          depth === 1 ? "font-semibold text-blue-100" : "",
          depth > 1 ? "text-sm" : "",
        )}
      >
        {/* Item Column (Spans 3fr equivalent in CSS) */}
        <div className="flex items-center pr-2" style={{ paddingLeft }}>
          <button
            onClick={toggle}
            className={clsx(
              "p-1 rounded-md mr-2 transition-colors",
              hasChildren
                ? "hover:bg-white/20 text-secondary cursor-pointer"
                : "opacity-0 cursor-default",
            )}
            disabled={!hasChildren}
          >
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          <div className="flex flex-col">
            <span className="mr-2 opacity-80 text-xs font-mono">
              {item.numbering}
            </span>
            <span
              className={clsx(
                "break-words",
                depth === 0 ? "uppercase tracking-wider" : "",
              )}
            >
              {item.description}
            </span>
          </div>
        </div>

        {/* Breakdown Columns */}
        <div className="text-center opacity-80 text-xs font-mono">
          {item.qty}
        </div>
        <div className="text-center opacity-80 text-xs font-mono">
          {item.hours}
        </div>
        <div className="text-center opacity-80 text-xs font-mono">
          {item.days}
        </div>
        <div className="text-center opacity-80 text-xs font-mono">
          {item.months}
        </div>

        {/* Volume */}
        <div className="text-center opacity-90 text-sm">{item.volume}</div>

        {/* Unit */}
        <div className="text-center opacity-90 text-sm">{item.unit}</div>

        {/* Total Price */}
        <div className="text-right font-mono font-medium text-secondary">
          {formatCurrency(item.totalPrice)}
        </div>
      </motion.div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <RabRow key={child.id} item={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
