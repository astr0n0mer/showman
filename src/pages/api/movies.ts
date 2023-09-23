import type { NextApiRequest, NextApiResponse } from "next";

import type { Movie } from "./_store";
import { MovieService } from "./_store";
import type { Message } from "./_types";

const getHandler = async (
  request: NextApiRequest,
  response: NextApiResponse<Movie[]>
) => {
  const movies = await MovieService.getInstance().getMany();
  response.status(200).json(movies);
};

const handler = (
  request: NextApiRequest,
  response: NextApiResponse<Movie[] | Message>
) => {
  switch (request.method) {
    case "GET":
      getHandler(request, response);
      break;

    default:
      response.status(405).json({
        message: `${request.method} method not allowed on /api/movies endpoint`,
      });
  }
};

export default handler;
