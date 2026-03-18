export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Announcement bar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black h-9" />

      {/* Navbar placeholder */}
      <div className="fixed top-9 left-0 right-0 z-40 bg-transparent h-14" />

      {/* Hero skeleton */}
      <div className="h-screen bg-zinc-100" />

      {/* Editorial tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[65vh]">
        <div className="bg-zinc-200 min-h-[55vw] md:min-h-0" />
        <div className="bg-zinc-100 min-h-[55vw] md:min-h-0" />
      </div>

      {/* Marquee */}
      <div className="bg-zinc-900 h-12" />

      {/* Product grid */}
      <div className="py-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="h-16 w-64 bg-zinc-100 mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-zinc-100 mb-3" />
                <div className="h-3 bg-zinc-100 mb-2 w-3/4" />
                <div className="h-3 bg-zinc-100 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
