export function Searchbar() {
  return (
    <form className="max-w-2xl mx-auto">
      <div className="flex">
        <label htmlFor="search-dropdown" className="sr-only">Search</label>
        
        <select className="px-4 py-2 border border-r-0 rounded-l-md bg-gray-50 text-sm">
          <option>All categories</option>
          <option>Shopping</option>
          <option>Images</option>
          <option>News</option>
          <option>Finance</option>
        </select>

        <input
          type="search"
          id="search-dropdown"
          className="flex-1 px-4 py-2 border text-sm"
          placeholder="Search for products"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md text-sm hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}