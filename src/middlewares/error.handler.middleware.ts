import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { CustomError } from '../errors/CustomError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.message);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
  return;
}
