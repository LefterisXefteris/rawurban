import { Navbar } from "@/components/navbar/page";

const sections = [
  {
    heading: "Storefront Use",
    body:
      "By using this storefront, you agree to browse and purchase in good faith, provide accurate checkout details, and avoid misuse of the site, pricing, or promotional mechanics.",
  },
  {
    heading: "Orders & Availability",
    body:
      "All orders are subject to stock availability and review. If an item becomes unavailable, the team may adjust or cancel the order and issue the appropriate refund or follow-up communication.",
  },
  {
    heading: "Returns & Support",
    body:
      "Return windows, shipping timing, and support handling follow the guidance provided in the storefront support section. For help with an order, contact support before initiating chargebacks or duplicate claims.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-4 pb-20 pt-32 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.45em] text-zinc-400">
            Legal
          </p>
          <h1 className="mt-4 font-serif italic text-5xl leading-none text-black md:text-7xl">
            Terms of Service
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-base">
            These terms outline the expectations for purchases, order handling,
            and responsible use of the Two Stones storefront.
          </p>

          <div className="mt-14 space-y-10 border-t border-zinc-200 pt-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-black">
                  {section.heading}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
