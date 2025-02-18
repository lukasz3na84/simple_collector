import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serialize(): { message: string; } {
    return { message: this.message };
  }
}
