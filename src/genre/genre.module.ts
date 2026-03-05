import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [GenreController],
    providers: [GenreService]
})
export class GenreModule {}