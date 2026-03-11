import { HttpException,HttpStatus } from "@nestjs/common";

export class baseExeptions extends HttpException{
    private readonly errorCode:string;
    constructor(message:string,statusCode:number,errorCode:string){
        super(message,statusCode);
        this.errorCode = errorCode;
    }
}

export class validationException extends baseExeptions{
    constructor(message:string,erorrCode:string){
        super(message,HttpStatus.BAD_REQUEST,erorrCode)
    }
    
}

export class NotFoundException extends baseExeptions{
    constructor(entityName:string){
        super(`${entityName} not found`,HttpStatus.NOT_FOUND,'RESOURCE_NOT_FOUND');
    }
}
