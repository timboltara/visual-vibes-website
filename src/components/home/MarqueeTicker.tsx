import React from "react";

const items = [
  "Wear Your Faith",
  "BLESSED26",
  "Spring Drop 2025",
  "Faith Over Fear",
  "Visual Vibes",
  "Romans 1:16",
  "New Arrivals",
  "Shop Now",
];

export default function MarqueeTicker() {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="bg-vv-black py-3 overflow-hidden border-y border-white/5">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marquee 22s linear infinite;
          width: max-content;
          display: flex;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-0">
            <span className="font-heading text-xs uppercase tracking-widest2 text-white whitespace-nowrap px-6">
              {item}
            </span>
            <span className="text-vv-orange text-xs">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
