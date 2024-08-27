import { useRef } from "react";
import { useKey } from "./useKey";

function Search({ query, setQuery }: { query: string; setQuery: (val: string) => void }) {
  const inputEle = useRef<HTMLInputElement>(null);
  useKey("Enter", () => {
    inputEle.current?.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEle}
    />
  );
}
export default Search;
