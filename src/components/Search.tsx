function Search({ query, setQuery }: { query: string; setQuery: (val: string) => void }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
export default Search;
