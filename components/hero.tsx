export function Hero() {
  return (
    <section 
      className="relative h-[70vh] flex items-center justify-center bg-cover bg-center bg-[url('/snow.jpg')] mask-alpha mask-r-from-black mask-r-from-50% mask-r-to-transparent"
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">New Season Arrivals</h1>
        <p className="text-xl mb-8">Discover our latest outdoor collection</p>
      </div>
    </section>
  );
}