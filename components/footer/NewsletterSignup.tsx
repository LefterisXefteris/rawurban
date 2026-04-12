"use client";

import { useEffect, useState, type FormEvent } from "react";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSubmitted(false);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [submitted]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-zinc-800 bg-zinc-950 px-4 py-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">
          You&rsquo;re in. Early access unlocked.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Drop notes and private offers will land here first.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        placeholder="Your email address"
        className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-[12px] text-white placeholder:text-zinc-600 transition-colors focus:border-white focus:outline-none"
      />
      <button
        type="submit"
        className="bg-white py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-200"
      >
        Subscribe
      </button>
    </form>
  );
}
