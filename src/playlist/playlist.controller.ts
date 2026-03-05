import { Controller, Delete, Get, Param, Post,Body, Put } from "@nestjs/common";
import { CreatePlaylistDto, UpdatePlaylistDto } from "./playlist.dto";
import { PlaylistService } from "./playlist.service";

@Controller('playlist')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}

    @Post()
    async createPlaylist(@Body() playlist: CreatePlaylistDto): Promise<any> {
        return await this.playlistService.createPlaylist(playlist);
    }
    @Get(':id')
    async getPlaylist(@Param('id') id: string): Promise<any> {
        return await this.playlistService.getPlaylist(id);
    }
    @Delete(':id')
    async deletePlaylist(@Param('id') id: string): Promise<string> {
        return await this.playlistService.deletePlaylist(id);
    }
    @Put(':id')
    async updatePlaylist(@Body() id: string,playlist: UpdatePlaylistDto): Promise<any> {
        return await this.playlistService.updatePlaylist(id, playlist);
    }
}