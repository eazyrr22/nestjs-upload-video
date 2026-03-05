import { IsString, IsEmpty, IsIn } from 'class-validator';

export class CreateVideoDto {
    @IsString()
    @IsEmpty()
    title: string;

    @IsString()
    @IsEmpty()
    description: string;

    @IsString()
    @IsEmpty()
    author: string;

    @IsString()
    @IsEmpty()
    @IsIn(['adults', 'teens', 'kids'])
    targetAudience: string;

    @IsString()
    @IsEmpty()  
    genre: string;

    @IsString()
    @IsEmpty()
    duration: string;
}

export class UpdateVideoDto {
    @IsString()
    title?: string;

    @IsString()
    description?: string;

    @IsString()
    author?: string;

    @IsString()
    @IsIn(['adults', 'teens', 'kids'])
    targetAudience?: string;

    @IsString()
    genre?: string;

    @IsString()
    duration?: string;
}       