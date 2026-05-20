import { Navbar } from "@/components/navbar/page";
import Link from "next/link";

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="flex min-h-screen items-center justify-center px-4 pb-20 pt-32 md:px-8 lg:px-12">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-red-500">
            Sale
          </p>
          <h1 className="mt-5 font-serif italic text-6xl leading-none text-black md:text-8xl">
            Coming Soon
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-500 md:text-base">
            The sales section is being prepared. Check back soon for limited
            offers and seasonal drops.
          </p>
          <Link
            href="/collections/all"
            className="mt-10 inline-flex bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-70"
          >
            Shop All
          </Link>
        </section>
      </main>
    </div>
  );
}
