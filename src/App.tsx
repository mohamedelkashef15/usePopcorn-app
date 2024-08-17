/*
  - Add loading effect

  - handle errors 
    - lost internet connection
    - movie is not found 

  - handle query 
    - on typing inside search update value of query
    - setError message to nothing before fetch any data
    - display Movie not found in case of length more than 3 charcters
*/

import { ReactNode, useEffect, useState } from "react";
import StarRating from "./StarRating";

interface IMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface IWatched {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
}

interface IMovieDetails {
  Poster?: string;
  Title?: string;
  Runtime?: string;
  imdbRating?: string;
  Plot?: string;
  Released?: string;
  Actors?: string;
  Director?: string;
  Genre?: string;
  Year?: string;
}

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr: number[]) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

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
      async function fetchData() {
        try {
          setError("");
          setIsLoading(true);

          const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`);
          if (res.ok === false) throw new Error("Something went wrong while fetching data");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }
      }

      fetchData();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
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

function ErrorMessage({ message }: { message: string }) {
  return <p className="error">{message}</p>;
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ children }: { children: ReactNode }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
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
function NumResult({ movies }: { movies: IMovie[] }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results{" "}
    </p>
  );
}

function Main({ children }: { children: ReactNode }) {
  return <main className="main">{children}</main>;
}

function Box({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

/*
function WatchedBox() {
  const [isOpen2, setIsOpen2] = useState(true);
  

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen2((open) => !open)}>
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, onSelectedId }: { movies: IMovie[]; onSelectedId: (id: string) => void }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedId={onSelectedId} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedId }: { movie: IMovie; onSelectedId: (id: string) => void }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }: { watched: IWatched[] }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteItem }: { watched: IWatched[]; onDeleteItem: (id: string) => void }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteItem={onDeleteItem} />
      ))}
    </ul>
  );
}
// I watched because it watched list
function WatchedMovie({ movie, onDeleteItem }: { movie: IWatched; onDeleteItem: (id: string) => void }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteItem(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onBack,
  onAddWatched,
  watched,
}: {
  selectedId: string;
  onBack: () => void;
  onAddWatched: (movie: IWatched) => void;
  watched: IWatched[];
}) {
  // movie is object inside
  const [movie, setMovie] = useState<IMovieDetails>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  /* 
    To check if movie is included in watched List or not 
      - to start comparision we need to compare imdbID with selectedId
  */
  const isWatched = watched.map((movie: IWatched) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const { Poster, Title, Runtime, imdbRating, Plot, Released, Actors, Director, Genre, Year }: IMovieDetails = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title,
      Poster,
      Year,
      imdbRating: Number(imdbRating),
      runtime: Number(Runtime?.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onBack();
  }

  useEffect(
    function () {
      setIsLoading(true);
      async function getMovieDetails() {
        const res = await fetch(`http://www.omdbapi.com/?&apikey=${KEY}&i=${selectedId}`);
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedId]
  );

  // Change page title
  useEffect(
    function () {
      // For not displaying undefined before showing the movie
      if (!Title) return;
      document.title = `${Title}`;

      return function () {
        document.title = "usePopcorn";
        console.log(document.title);
      };
    },
    [Title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onBack}>
              &larr;
            </button>
            <img src={Poster} alt={`Poster of ${Title} movie`} />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} size={25} color="red" onSetRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated that movie with {watchedUserRating} ⭐️</p>
              )}
            </div>
            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring {Actors}</p>
            <p>Dicrected by {Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
