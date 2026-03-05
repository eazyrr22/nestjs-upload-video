import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { CreateGenreDto } from "./genre.dto";

@Controller('genre')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Post()
    async createGenre(@Body() genre: CreateGenreDto): Promise<any> {
        return await this.genreService.createGenre(genre);
    }
    @Get(':id')
    async getGenre(@Param('id') id: string): Promise<any> {
        return await this.genreService.getGenre(id);
    }
    @Delete(':id')
    async deleteGenre(@Param('id') id: string): Promise<string> {
        return await this.genreService.deleteGenre(id);
    }
}