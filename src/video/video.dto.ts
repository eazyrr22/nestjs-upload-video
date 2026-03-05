import { IsString, IsNotEmpty, IsOptional, IsEnum, IsIn } from 'class-validator';

export enum VideoGenres {
    HORROR = 'horror',
    DOCUMENTARY = 'documentary',
    COMEDY = 'comedy',
    ACTION = 'action',
    DRAMA = 'drama',
}

export class CreateVideoDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['adults', 'teens', 'kids'])
    targetAudience: string;

    @IsEnum(VideoGenres)
    @IsNotEmpty()
    genre: string;

    @IsString()
    @IsNotEmpty()
    duration: string;
}

export class UpdateVideoDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()   
    description?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsString()
    @IsIn(['adults', 'teens', 'kids'])
    @IsOptional()
    targetAudience?: string;

    @IsString()
    @IsOptional()
    genre?: string;

    @IsString()
    @IsOptional()
    duration?: string;
}       