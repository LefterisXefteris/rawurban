"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cart } from "../Cart";
import { Menu, Search, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

const announcements = [
  "FREE UK DELIVERY ON ORDERS OVER £75",
  "NEW SEASON DROPS — SHOP THE LATEST",
  "FREE RETURNS ON ALL ORDERS",
];

const navLinks = [
  { label: "New In",       href: "/collections/new-arrivals" },
  { label: "Collections",  href: "/collections/all" },
  { label: "Essentials",   href: "/collections/essentials" },
  { label: "Sale",         href: "/collections/all", hot: true },
];

export function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // The homepage hero is a full-bleed dark image → start transparent + white.
  // Every other page has a white background → start transparent + black.
  const heroIsDark = pathname === "/";

  // When scrolled the bar is solid black → always use white.
  // When transparent, colour depends on what's behind.
  const useDarkText = !scrolled && !heroIsDark;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((i) => (i + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <>
        {/* ── Announcement Bar (always black) ──────────────────────────── */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black h-9 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <m.p
              key={announcementIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-white text-[11px] font-semibold uppercase tracking-[0.25em] text-center px-4"
            >
              {announcements[announcementIdx]}
            </m.p>
          </AnimatePresence>
        </div>

        {/* ── Main Navbar ───────────────────────────────────────────────── */}
        <m.header
          className={cn(
            "fixed top-9 left-0 right-0 z-40 transition-all duration-300",
            scrolled
              ? "bg-black py-3 border-b border-white/10"
              : "bg-transparent py-4"
          )}
        >
          {/* Colour context — all child icons inherit currentColor */}
          <div
            className={cn(
              "max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between transition-colors duration-300",
              useDarkText ? "text-black" : "text-white"
            )}
          >
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -ml-2 hover:opacity-60 transition-opacity"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X    className="h-5 w-5" />
                : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-serif italic text-2xl shrink-0 hover:opacity-70 transition-opacity tracking-wide"
            >
              Two Stones
            </Link>

            {/* Desktop nav — centred absolutely */}
            <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map(({ label, href, hot }) => (
                <Link
                  key={label}
                  href={href}
                  className="relative text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-60 transition-opacity group"
                >
                  {label}
                  {hot && (
                    <span className="absolute -top-2 -right-4 text-[8px] font-black text-red-400 tracking-normal">
                      HOT
                    </span>
                  )}
                  {/* Underline matches icon colour */}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300",
                      useDarkText ? "bg-black" : "bg-white"
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button
                className="p-2 hover:opacity-60 transition-opacity hidden md:block"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <button
                className="p-2 hover:opacity-60 transition-opacity hidden md:block"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" />
              </button>
              {/* Pass isDark so the cart badge flips colour too */}
              <Cart isDark={!useDarkText} />
            </div>
          </div>

          {/* ── Mobile slide-down menu (always on black bg) ────────────── */}
          <AnimatePresence>
            {mobileOpen && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-black border-t border-white/10 overflow-hidden"
              >
                <nav className="flex flex-col px-6 py-8 gap-6">
                  {navLinks.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="text-white text-base font-semibold uppercase tracking-[0.2em] hover:opacity-60 transition-opacity"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </m.div>
            )}
          </AnimatePresence>
        </m.header>
      </>
    </LazyMotion>
  );
}
