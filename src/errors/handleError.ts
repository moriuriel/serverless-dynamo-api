import { HttpError } from "./excepetions";

export const handleError = (e: unknown) => {
  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `invalid request body format : "${e.message}"` }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      body: e.message,
    };
  }

  throw e;
};
