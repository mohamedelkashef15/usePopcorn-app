import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import { IWatched } from "./components/interfaces";
import Logo from "./components/Logo";
import NumResult from "./components/NumResult";
import Search from "./components/Search";
import Main from "./components/Main";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import WatchedSummary from "./components/WatchedSummary";
import { WatchedMovieList } from "./components/WatchedMovieList";
import MovieDetails from "./components/MovieDetails";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";

const KEY = "2e5ceddc";
// const query = "Interstellar";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState<IWatched[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<null | string>(null);

  function handleSelectedId(id: string) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleBackBtn() {
    setSelectedId(null);
  }

  function handleAddWatchedList(movie: IWatched) {
    setWatched((watchedMoives: IWatched[]) => [...watchedMoives, movie]);
  }

  function handleDelete(id: string) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        try {
          setError("");
          setIsLoading(true);

          const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`, {
            signal: controller.signal,
          });
          if (res.ok === false) throw new Error("Something went wrong while fetching data");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if ((err as Error).name !== "AbortError") setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }
      }
      handleBackBtn();

      fetchData();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies}></MovieList>} */}
          {!isLoading && !error && <MovieList movies={movies} onSelectedId={handleSelectedId}></MovieList>}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onBack={handleBackBtn}
              onAddWatched={handleAddWatchedList}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDeleteItem={handleDelete} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
