import {Request,Response} from "express";
import {ExceptionFilter,HttpStatus,Catch,ArgumentsHost,HttpException } from "@nestjs/common";
import path from "path";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
       const context  = host.switchToHttp(); 
       const request = context.getRequest<Request>();
       const response = context.getResponse<Response>();

       const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
       const message = exception instanceof HttpException ? exception.getResponse() : "Internal Server Error";
       
       console.error(`Error occurred at ${request.method} ${request.url}:`, exception);

       response.status(status).json({
        statusCode: status,
        message: message,
        path: request.url,
        timestamp: new Date().toISOString()
       })
    }
}