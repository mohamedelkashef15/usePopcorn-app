import { IWatched } from "./interfaces";

export function WatchedMovieList({
  watched,
  onDeleteItem,
}: {
  watched: IWatched[];
  onDeleteItem: (id: string) => void;
}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteItem={onDeleteItem} />
      ))}
    </ul>
  );
}
// I watched because it watched list
export function WatchedMovie({ movie, onDeleteItem }: { movie: IWatched; onDeleteItem: (id: string) => void }) {
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
