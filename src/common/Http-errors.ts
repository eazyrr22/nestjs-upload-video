import { Request, Response } from "express";
import { Injectable, Logger } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { ExceptionFilter, HttpStatus, Catch, ArgumentsHost, HttpException, Inject } from "@nestjs/common";

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger;


    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.getResponse() : "Internal Server Error";

        this.logger.error(`Error occurred at ${request.method} ${request.url}:`, exception);

        response.status(status).json({
            statusCode: status,
            message: message,
            path: request.url,
            timestamp: new Date().toISOString()
        })
    }
}