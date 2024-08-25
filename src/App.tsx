import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import { IMovie, IWatched } from "./components/interfaces";
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
import { useMovies } from "./components/useMovies";

// const query = "Interstellar";

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState<null | string>(null);
  // const [watched, setWatched] = useState<IWatched[]>([]);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return storedValue && JSON.parse(storedValue);
  });

  function handleSelectedId(id: string) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleBackBtn() {
    setSelectedId(null);
  }

  function handleAddWatchedList(movie: IWatched) {
    setWatched((watched: IWatched[]) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDelete(id: string) {
    setWatched(watched.filter((movie: IMovie) => movie.imdbID !== id));
  }

  /* Set Item  */
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  const { movies, error, isLoading } = useMovies(query);

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
