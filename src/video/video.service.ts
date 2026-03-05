import { join } from 'path';
import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';

import { CreateVideoDto } from './video.dto';
import { TranscoderService } from './video.transcode';
import { type IStorage } from '../databases/storage.interface';
import { STORAGE_TOKEN } from '../databases/storage.interface';

@Injectable()
export class VideoService {
    constructor(
        @Inject(STORAGE_TOKEN) private readonly storage: IStorage,
        private readonly configService: ConfigService,
        private readonly transcoderService: TranscoderService,
    ) { }

    getAllVideos = async () => {
        return this.storage.getItems('video');
    }

    encodeAndSave = async (file: Express.Multer.File, dto: CreateVideoDto) => {
        try {
            const storagePath = this.configService.get<string>('FILE_STORAGE_PATH')!;

            await fs.ensureDir(storagePath);
            const outputPath = join(storagePath, `encoded-${file.filename}.mp4`);

            await this.transcoderService.transcode(file.path, outputPath);
            const videoMetadata = {
                ...dto,
                fileUrl: outputPath,
            };
            await this.storage.insertItem('video', videoMetadata);
            return videoMetadata;
        } finally {
            await fs.remove(file.path);
        }
    }
    deleteVideo(id: string) {
        return this.storage.deleteItem('video', id);
    }
    findVideo(filters: Partial<CreateVideoDto>) {
        return this.storage.findByFilters('video', filters);
    }
}