import { Injectable, Inject } from '@nestjs/common';
import { CreateGenreDto } from './genre.dto';
import { STORAGE_TOKEN } from '../databases/storage.interface';
import type { IStorage } from '../databases/storage.interface';

@Injectable()
export class GenreService {
  constructor(
    @Inject(STORAGE_TOKEN) private readonly storage: IStorage,
  ) { }

  createGenre = async (genre: CreateGenreDto): Promise<any> => {
    await this.storage.insertItem('genre', genre);
    return 'genre created successfully';
  }

  getGenre = async (id: string): Promise<any> => {
    return await this.storage.getItem('genre', id);
  }

  deleteGenre = async (id: string): Promise<string> => {
    return this.storage.deleteItem('genre', id);
  }
}