import {  IsString, IsNotEmpty,IsArray } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  videos: string[]; 

}

export class UpdatePlaylistDto {
  @IsString()
  id: string;

  @IsString()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  videos?: string[];
}