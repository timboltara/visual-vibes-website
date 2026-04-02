"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-brand-teal text-white text-center py-2.5 px-4 flex items-center justify-center gap-4 relative">
      <p className="font-body text-sm tracking-wide">
        Use code{" "}
        <span className="font-semibold text-brand-orange bg-white/10 px-1.5 py-0.5 rounded">
          BLESSED26
        </span>{" "}
        for 15% off your first order
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}
