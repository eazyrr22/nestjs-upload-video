import { join } from 'path';
import * as fs from 'fs-extra';
import ffmpeg from 'fluent-ffmpeg';
import { ConfigService } from '@nestjs/config';
import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';

import { CreateVideoDto } from './video.dto';
import { type IStorage } from '../databases/storage.interface';
import { STORAGE_TOKEN } from '../databases/storage.interface';

@Injectable()
export class VideoService {
    constructor(
        @Inject(STORAGE_TOKEN) private readonly storage: IStorage,
        private readonly configService: ConfigService,
    ) { }

    getAllVideos = async () => {
        return this.storage.getItems('video');
    }

    encodeAndSave = async (file: Express.Multer.File, dto: CreateVideoDto) => {
        const storagePath = this.configService.get<string>('FILE_STORAGE_PATH')!;

        await fs.ensureDir(storagePath);
        const outputPath = join(storagePath, `encoded-${file.filename}.mp4`);

        const codec = this.configService.get<string>('VIDEO_CODEC', 'libx264');
        const bitrate = this.configService.get<string>('VIDEO_BITRATE', '1000k');

        return new Promise((resolve, reject) => {
            ffmpeg(file.path)
                .videoCodec(codec)
                .videoBitrate(bitrate)
                .format('mp4')
                .on('error', (err) => {
                    fs.removeSync(file.path);
                    reject(new InternalServerErrorException('Encoding failed: ' + err.message));
                })
                .on('end', async () => {
                    const videoMetadata = {
                        ...dto,
                        fileUrl: outputPath,
                    };
                    await this.storage.insertItem('video', videoMetadata);

                    await fs.remove(file.path);

                    resolve(videoMetadata);
                })
                .save(outputPath);
        });
    }
    deleteVideo(id: string) {
        return this.storage.deleteItem('video', id);
    }
    findVideo(filters: Partial<CreateVideoDto>) {
        return this.storage.findItems('video', filters);
    }
}