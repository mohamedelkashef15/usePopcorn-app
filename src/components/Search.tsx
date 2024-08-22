import { useEffect, useRef } from "react";

function Search({ query, setQuery }: { query: string; setQuery: (val: string) => void }) {
  const inputEle = useRef<HTMLInputElement>(null);

  useEffect(
    function () {
      function callback(e: KeyboardEvent) {
        if (e.code === "Enter") {
          inputEle.current!.focus();
          setQuery("");
        }
      }

      document.addEventListener("keypress", callback);

      return () => {
        document.removeEventListener("keypress", callback);
      };
    },
    [setQuery]
  );

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
