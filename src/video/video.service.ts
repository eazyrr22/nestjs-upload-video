import { join } from 'path';
import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { IVideo } from './video.interface';
import { CreateVideoDto, UpdateVideoDto } from './video.dto';
import { type IStorage } from '../databases/storage.interface';
import { STORAGE_TOKEN } from '../databases/storage.interface';
import { TranscoderService } from '../ffmpeg/transcode.service';

@Injectable()
export class VideoService {
    constructor(
        @Inject(STORAGE_TOKEN) private readonly storage: IStorage,
        private readonly configService: ConfigService,
        private readonly transcoderService: TranscoderService,
    ) { }

    getAllVideos = async () => {
        return this.storage.getItems<IVideo>('video');
    }

    encodeAndSave = async (file: Express.Multer.File, dto: CreateVideoDto) => {
        try {
            const storagePath = this.configService.get<string>('localStorage.localStoragePath')!;

            await fs.ensureDir(storagePath);
            const outputPath = join(storagePath, `encoded-${file.filename}.mp4`);

            await this.transcoderService.transcode(file.path, outputPath);
            const videoMetadata = {
                ...dto,
                fileUrl: outputPath,
            } as Partial<IVideo>;
            await this.storage.insertItem<IVideo>('video', videoMetadata);
            return videoMetadata;
        } finally {
            await fs.remove(file.path);
        }
    }

    updateVideo = async (dto: UpdateVideoDto, file?: Express.Multer.File) => {
        const existingVideo = await this.storage.getItem<IVideo>('video', dto.id);
        if (!existingVideo) throw new NotFoundException('Video not found');

        let updateData = { ...dto } as Partial<IVideo>;

        if (file) {
            try {
                const storagePath = this.configService.get<string>('localStorage.localStoragePath')!;

                await fs.ensureDir(storagePath);
                const outputPath = join(storagePath, `encoded-${file.filename}.mp4`);

                await this.transcoderService.transcode(file.path, outputPath);

                if (existingVideo.fileUrl) {
                    await fs.remove(existingVideo.fileUrl);
                }
                updateData['fileUrl'] = outputPath;
            } catch (error) {
                throw new InternalServerErrorException('Failed to update video');
            } finally {
                await fs.remove(file.path);
            }
        }
        return this.storage.updateItem<IVideo>('video', updateData);
    }

    deleteVideo = async (id: string) => {
        return this.storage.deleteItem<IVideo>('video', id);
    }
    findVideo = async (filters: Partial<IVideo>) => {
        return this.storage.findByFilters!<IVideo>('video', filters);
    }
}