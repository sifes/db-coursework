import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidInputDataException extends HttpException {
  constructor(field: string, reason: string) {
    super(`Invalid data for ${field}: ${reason}`, HttpStatus.BAD_REQUEST);
  }
}
