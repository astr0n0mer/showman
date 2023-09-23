import { NextApiRequest, NextApiResponse } from "next";

import type { Movie } from "../_store";
import { MovieService } from "../_store";
import type { Message } from "../_types";

const getHandler = async (
  request: NextApiRequest,
  response: NextApiResponse<Movie | Message>
) => {
  const { id } = request.query;

  try {
    const movie = await MovieService.getInstance().getOne(Number(id));
    response.status(200).json(movie);
  } catch (error) {
    if (error instanceof Error)
      response.status(404).json({ message: error.message });
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
