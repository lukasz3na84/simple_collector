export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serialize(): { message: string };

  constructor(public message: string) {
    super(message);
  }
}