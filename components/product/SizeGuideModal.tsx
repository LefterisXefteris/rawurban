"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const SIZE_ROWS = [
  { size: "XS", chest: '31"', waist: '24"', hip: '34"' },
  { size: "S", chest: '33"', waist: '26"', hip: '36"' },
  { size: "M", chest: '35"', waist: '28"', hip: '38"' },
  { size: "L", chest: '38"', waist: '31"', hip: '41"' },
  { size: "XL", chest: '41"', waist: '34"', hip: '44"' },
];

export function SizeGuideModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-[11px] underline underline-offset-4 text-zinc-500 transition-colors hover:text-black"
        >
          Size Guide
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 transition-opacity duration-[200ms] ease-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,680px)] -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-6 shadow-2xl outline-none data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.98] data-[state=open]:opacity-100 data-[state=open]:scale-100 transition duration-[200ms] ease-out sm:px-7 sm:py-8">
          <div className="mb-6 pr-10">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
              Fit Reference
            </p>
            <Dialog.Title className="text-lg font-bold uppercase tracking-[0.18em] text-black">
              Size Guide
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-zinc-500">
              A clean fit guide for the current range.
            </Dialog.Description>
          </div>

          <div className="overflow-hidden border border-zinc-200">
            <table className="w-full border-collapse text-left">
              <thead className="bg-zinc-50">
                <tr>
                  {["Size", "Chest", "Waist", "Hip"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_ROWS.map((row) => (
                  <tr key={row.size} className="border-t border-zinc-200">
                    <th
                      scope="row"
                      className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black"
                    >
                      {row.size}
                    </th>
                    <td className="px-4 py-3 text-sm text-zinc-600">{row.chest}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{row.waist}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close size guide"
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition-colors hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
