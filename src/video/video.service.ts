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
        private readonly fileStorage: IFileStorage;
    ) { }

    encodeVideo = async (file: Express.Multer.File,) => {
        const storagePath = this.configService.get<string>('localStorage.localStoragePath')!;

        await fs.ensureDir(storagePath);

        const outputPath = join(storagePath, `encoded-${file.filename}.mp4`);

        await this.transcoderService.transcode(file.path, outputPath);

        return outputPath;
    }

    saveVideoMetadata = async (dto: CreateVideoDto, fileUrl: string) => {
        const videoMetadata = {
            ...dto,
            fileUrl: fileUrl,
        } as Partial<IVideo>;

        await this.storage.insertItem<IVideo>('video', videoMetadata);
        console.log('Video metadata saved successfully');
    }

    saveVideoFile = async (sourceFilePath: string) => {

        await fs.pathExists(sourceFilePath);

        const url = await this.fileStorage.saveFile(sourceFilePath);

        return url;
    }

    uploadAndSaveVideo = async (file: Express.Multer.File, dto: CreateVideoDto) => {
        const outputPath = await this.encodeVideo(file);

        const url = await this.saveVideoFile(outputPath);

        await this.saveVideoMetadata(dto, url);

        await fs.remove(outputPath);
    }

    getAllVideos = async () => {
        return this.storage.getItems<IVideo>('video');
    }

    updateVideo = async (dto: UpdateVideoDto, file?: Express.Multer.File) => {
        const existingVideo = await this.storage.getItem<IVideo>('video', dto.id);

        if (!existingVideo) throw new NotFoundException('Video not found');

        let updateData = { ...dto } as Partial<IVideo>;

        if (file) {
            const outputPath = await this.encodeVideo(file);

            const url = await this.saveVideoFile(outputPath);

            if (existingVideo.fileUrl) { await fs.remove(existingVideo.fileUrl);}
        
            await fs.remove(outputPath);

            updateData['fileUrl'] = url;
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