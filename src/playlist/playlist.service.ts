import { Inject, Injectable } from "@nestjs/common";
import { STORAGE_TOKEN } from '../databases/storage.interface';
import type { IStorage } from '../databases/storage.interface';
import { CreatePlaylistDto, UpdatePlaylistDto } from "./playlist.dto";


@Injectable()
export class PlaylistService {
    constructor(
        @Inject(STORAGE_TOKEN) private readonly storage: IStorage,
    ) { }

     createPlaylist = async (playlist: CreatePlaylistDto): Promise<any> => {
        await this.storage.insertItem('playlist', playlist);
        return 'playlist created successfully';
    }

     getPlaylist = async (id: string): Promise<any> => {
        return  this.storage.getItem('playlist', id);
    }

     deletePlaylist = async (id: string): Promise<string> => {
        return this.storage.deleteItem('playlist', id);
    }
    updatePlaylist = async (id: string, playlist: UpdatePlaylistDto): Promise<any> => {
        return this.storage.updateItem('playlist', id, playlist);
    }
}   