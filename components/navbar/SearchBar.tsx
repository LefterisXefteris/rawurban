"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestions = [
  { href: "/collections/new-arrivals", label: "New Arrivals" },
  { href: "/collections/essentials", label: "Essentials" },
  { href: "/collections/all", label: "Shop All" },
];

export function SearchBar({
  open,
  onClose,
  useDarkText,
}: {
  open: boolean;
  onClose: () => void;
  useDarkText: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="navbar-search-overlay"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full mt-4"
        >
          <div
            className={cn(
              "overflow-hidden border shadow-[0_24px_80px_rgba(0,0,0,0.12)]",
              useDarkText
                ? "border-zinc-200 bg-white text-black"
                : "border-white/10 bg-black text-white"
            )}
          >
            <form
              onSubmit={(event) => event.preventDefault()}
              className="border-b border-current/10 p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 shrink-0 opacity-50" />
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search the store"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-current/45"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1 transition-opacity hover:opacity-60"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="space-y-5 p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-current/55">
                Search previews land next phase. Start with a collection below.
              </p>

              <div className="grid gap-2">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.href}
                    href={suggestion.href}
                    onClick={onClose}
                    className="flex items-center justify-between border border-current/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:border-current/30"
                  >
                    <span>{suggestion.label}</span>
                    <span className="text-current/40">View</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
