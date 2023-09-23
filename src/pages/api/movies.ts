import type { NextApiRequest, NextApiResponse } from "next";

import type { Movie } from "./_store";
import { MovieService, parseRawMovieInput } from "./_store";
import type { Message } from "./_types";

const getHandler = async (
  request: NextApiRequest,
  response: NextApiResponse<Movie[]>
) => {
  const movies = await MovieService.getInstance().getMany();
  response.status(200).json(movies);
};

const posthandler = async (
  request: NextApiRequest,
  response: NextApiResponse<Movie | Message>
) => {
  try {
    const movie = request.body;
    const parsedMovie = parseRawMovieInput(movie);
    console.log("parsedMovie:", parsedMovie);

    const id = await MovieService.getInstance().addOne(parsedMovie);
    const updatedMovie = await MovieService.getInstance().getOne(id);
    response.status(201).json(updatedMovie);
  } catch (error) {
    if (error instanceof Error)
      response.status(400).json({
        message: error.message,
      });
  }
};

const handler = (
  request: NextApiRequest,
  response: NextApiResponse<Movie[] | Movie | Message>
) => {
  switch (request.method) {
    case "GET":
      getHandler(request, response);
      break;

    case "POST":
      posthandler(request, response);
      break;

    default:
      response.status(405).json({
        message: `${request.method} method not allowed on /api/movies endpoint`,
      });
  }
};

export default handler;
