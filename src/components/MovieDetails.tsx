import { IWatched, IMovieDetails } from "./interfaces";
import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";

const KEY = "2e5ceddc";
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

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  function handleAdd() {
    const newWatchedMovie: IWatched = {
      imdbID: selectedId,
      Title,
      Poster,
      Year,
      imdbRating: Number(imdbRating),
      runtime: Number(Runtime?.split(" ")[0]),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onBack();
  }

  const imdbAverage = (Number(imdbRating) + Number(userRating)) / 2;

  useEffect(function () {
    function callback(e: KeyboardEvent) {
      if (e.code === "Escape") onBack();
    }

    document.addEventListener("keydown", callback);

    return function () {
      document.removeEventListener("keydown", callback);
    };
  });

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

  useEffect(
    function () {
      if (!document.title) return;
      document.title = `${Title}`;

      return function () {
        document.title = "usePopcorn";
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
                {imdbRating} IMDB rating <span>{imdbAverage} IMDB Average</span>
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

export default MovieDetails;
