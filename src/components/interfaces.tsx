export interface IMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface IWatched {
  imdbID: string;
  Title?: string;
  Year?: string;
  Poster?: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
}

export interface IMovieDetails {
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
