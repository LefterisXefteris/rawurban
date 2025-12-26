import { Searchbar } from "../laoyout/SearchBar";

export async function Navbar() {
  return (
    <nav className="block w-full max-w-screen-lg px-4 py-2 mx-auto bg-white bg-opacity-90 sticky top-3 shadow lg:px-8 lg:py-3 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
      <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
        <div className="flex items-center justify-end py-4">
        <div className="hidden lg:block space-x-6">
            <a href="#" className="hover:text-red-900 transition">Men</a>
            <a href="#" className="hover:text-red-900 transition">Women</a>
            <a href="#" className="hover:text-red-900 transition">About</a>
          </div>
        </div>
        <div className="pb-6">
        </div>
        </div>
    </nav>
  );
}