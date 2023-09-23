import type { Id } from "./_types";

const movieKeys = ["id", "title", "description", "release_date"];

export type CreateMovieDTO = {
  title: string;
  description: string;
  release_date: Date;
};

export type Movie = {
  id: Id;
  title: string;
  description: string;
  release_date: Date;
};

export class MovieService {
  private static service: MovieService;
  private static idCounter = 0;
  private movies: Movie[] = [];

  private constructor() {}

  public static getInstance = () => {
    if (!MovieService.service) {
      MovieService.service = new MovieService();
    }
    return MovieService.service;
  };

  public getOne = (id: Id) => {
    const movie = this.movies.find((movie) => movie.id === id);
    if (!movie) throw new Error("movie_does_not_exist");

    return Promise.resolve(movie);
  };

  public getMany = () => Promise.resolve(this.movies);

  public addOne = (movie: CreateMovieDTO): Promise<Id> => {
    const id = ++MovieService.idCounter;
    this.movies.push({ id, ...movie });
    return Promise.resolve(id);
  };

  public deleteOne = (id: Id) => {
    const oldLength = this.movies.length;

    this.movies = this.movies.filter((movie) => movie.id !== id);
    if (this.movies.length === oldLength)
      throw new Error("movie_does_not_exist");

    return Promise.resolve();
  };

  public updateOne = (id: Id, movie: Movie) => {
    const oldLength = this.movies.length;

    const newMovies = this.movies.filter((movie) => movie.id !== id);
    if (newMovies.length === oldLength) throw new Error("movie_does_not_exist");

    this.movies = [...newMovies, movie];
    return Promise.resolve();
  };
}

export const parseRawMovieInput = (
  movie: CreateMovieDTO,
  allowPartials: boolean = false
) => {
  if (
    !allowPartials &&
    (movie.title === undefined ||
      movie.description === undefined ||
      movie.release_date === undefined)
  )
    throw new Error(`One or more fields missing [${movieKeys.join(", ")}]`);

  const parsedMovie: any = {};
  console.log("movie keys", Object.keys(movie));
  Object.keys(movie).forEach((key) => {
    if (movieKeys.includes(key)) parsedMovie[key] = movie[key];
  });

  if (parsedMovie.release_date)
    parsedMovie.release_date = new Date(parsedMovie.release_date);

  return parsedMovie;
};

const movies: CreateMovieDTO[] = [
  {
    title: "Oppenheimer",
    description:
      "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.",
    release_date: new Date("2023-09-1"),
  },
  {
    title: "Tenet",
    description:
      "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
    release_date: new Date("2022-10-15"),
  },
  {
    title: "Dunkirk",
    description:
      "Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.",
    release_date: new Date("2017-07-21"),
  },
];

movies.forEach(async (movie) => await MovieService.getInstance().addOne(movie));
