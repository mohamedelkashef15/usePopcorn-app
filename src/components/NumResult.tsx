import { IMovie } from "./interfaces";

function NumResult({ movies }: { movies: IMovie[] }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results{" "}
    </p>
  );
}

export default NumResult;
