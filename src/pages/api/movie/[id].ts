import { NextApiRequest, NextApiResponse } from "next";

import type { Movie } from "../_store";
import { MovieService, parseRawMovieInput } from "../_store";
import type { Message } from "../_types";

const getHandler = async (
  request: NextApiRequest,
  response: NextApiResponse<Movie | Message>
) => {
  const id = Number(request.query.id);

  try {
    const movie = await MovieService.getInstance().getOne(id);
    response.status(200).json(movie);
  } catch (error) {
    if (error instanceof Error)
      response.status(404).json({ message: error.message });
  }
};

const putHandler = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const id = Number(request.query.id);
  const movie = request.body;
  try {
    const parsedMovie = parseRawMovieInput(movie);
    await MovieService.getInstance().updateOne(id, {
      id,
      ...parsedMovie,
    });
    response.status(200).json(await MovieService.getInstance().getOne(id));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "movie_does_not_exist") {
        const parsedMovie = parseRawMovieInput(movie);
        const newId = await MovieService.getInstance().addOne(parsedMovie);
        const updatedMovie = await MovieService.getInstance().getOne(newId);
        response.status(200).json(updatedMovie);
      }
      response.status(400).json({ message: error.message });
    }
  }
};

const patchHandler = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const id = Number(request.query.id);
  const movie = request.body;
  try {
    const parsedMovie = parseRawMovieInput(movie, true);
    const oldMovie = await MovieService.getInstance().getOne(id);
    await MovieService.getInstance().updateOne(id, {
      ...oldMovie,
      ...parsedMovie,
    });
    const updatedMovie = await MovieService.getInstance().getOne(id);
    response.status(200).json(updatedMovie);
  } catch (error) {
    if (error instanceof Error)
      response.status(400).json({ message: error.message });
  }
};

const deleteHandler = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { id } = request.query;

  try {
    await MovieService.getInstance().deleteOne(Number(id));
    response.status(200).send("");
  } catch (error) {
    if (error instanceof Error)
      response.status(404).json({ message: error.message });
  }
};

const handler = (
  request: NextApiRequest,
  response: NextApiResponse<Movie | Message>
) => {
  switch (request.method) {
    case "GET":
      getHandler(request, response);
      break;

    case "PUT":
      putHandler(request, response);
      break;

    case "PATCH":
      patchHandler(request, response);
      break;

    case "DELETE":
      deleteHandler(request, response);
      break;

    default:
      response.status(405).json({
        message: `${request.method} method not allowed on /api/movie/[movie_id] endpoint`,
      });
  }
};

export default handler;
