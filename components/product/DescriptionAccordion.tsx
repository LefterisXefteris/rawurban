"use client";

import { useId, useState } from "react";

export function DescriptionAccordion({
  description,
}: {
  description: string;
}) {
  const [open, setOpen] = useState(true);
  const contentId = `product-description-${useId().replace(/:/g, "")}`;

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em]"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>Description</span>
        <span
          aria-hidden="true"
          className="relative flex h-3 w-3 items-center justify-center text-zinc-400 transition-transform duration-[200ms] ease-out"
        >
          <span className="absolute h-px w-3 bg-current" />
          <span
            className={[
              "absolute h-3 w-px bg-current transition-transform duration-[200ms] ease-out",
              open ? "rotate-90 scale-y-0" : "rotate-0 scale-y-100",
            ].join(" ")}
          />
        </span>
      </button>

      <div
        id={contentId}
        className={[
          "grid overflow-hidden transition-all duration-[200ms] ease-out",
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0">
          <p className="text-sm leading-relaxed text-zinc-500 whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
