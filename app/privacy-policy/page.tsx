import { Navbar } from "@/components/navbar/page";

const sections = [
  {
    heading: "What We Collect",
    body:
      "We collect the details you share at checkout or through account-free storefront interactions, including contact, shipping, and order information needed to fulfill purchases and support requests.",
  },
  {
    heading: "How We Use It",
    body:
      "Your information is used to process orders, coordinate delivery, prevent abuse, and improve the storefront experience. We do not sell customer data or publish personal details.",
  },
  {
    heading: "Retention & Requests",
    body:
      "Order records are kept only as long as needed for operational, legal, and accounting obligations. If you need a data access or deletion request reviewed, contact the team through the support channels linked in the storefront.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-4 pb-20 pt-32 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.45em] text-zinc-400">
            Legal
          </p>
          <h1 className="mt-4 font-serif italic text-5xl leading-none text-black md:text-7xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-base">
            This policy explains how Two Stones handles customer information across
            browsing, checkout, and support touchpoints.
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
