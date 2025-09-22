import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiResponseDto } from "../dto/api-response.dto";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Error interno del servidor";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse() as any;
      message = typeof r === "string" ? r : (r?.message ?? message);
      if (Array.isArray(message)) message = message.join(", ");
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const payload = ApiResponseDto.fail(message, status);
    res.status(status).json(payload);
  }
}
