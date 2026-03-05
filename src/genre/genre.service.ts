import { Injectable, Inject } from '@nestjs/common';
import { CreateGenreDto } from './genre.dto';
import { STORAGE_TOKEN } from '../databases/storage.interface';
import type { IStorage } from '../databases/storage.interface';
import { IGenre } from './genre.interface';

@Injectable()
export class GenreService {
  constructor(
    @Inject(STORAGE_TOKEN) private readonly storage: IStorage,
  ) { }

  createGenre = async (genre: CreateGenreDto): Promise<any> => {
    await this.storage.insertItem<IGenre>('genre', genre);
    return 'genre created successfully';
  }

  getGenre = async (id: string): Promise<any> => {
    return await this.storage.getItem<IGenre>('genre', id);
  }

  deleteGenre = async (id: string): Promise<string> => {
    return this.storage.deleteItem<IGenre>('genre', id);
  }
}