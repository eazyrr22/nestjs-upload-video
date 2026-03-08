import { dirname } from 'path';
import * as fs from 'fs-extra';
import ffmpeg from 'fluent-ffmpeg';
import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class TranscoderService {
    private readonly ffmpegPath: string;
    private readonly configService: ConfigService;
    private readonly encoderOptions: { codec: string, bitrate: string };

    constructor(configService: ConfigService) {
        this.configService = configService;
        this.ffmpegPath = process.env.FFMPEG_PATH! ;
        ffmpeg.setFfmpegPath(this.ffmpegPath);
        this.encoderOptions = {
            codec: this.configService.get<string>('videoSettings.codec', 'libx264'),
            bitrate: this.configService.get<string>('videoSettings.bitrate', '1000k'),
        };
    }

    transcode = async (inputPath: string, outputPath: string): Promise<void> => {
        await fs.ensureDir(dirname(outputPath));

        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoCodec(this.encoderOptions.codec)
                .videoBitrate(this.encoderOptions.bitrate)
                .format('mp4')
                .on('start', () => {
                    console.log('start transcoding');
                })
                .on('end', async () => {
                    console.log('Transcoding finished');
                    await fs.remove(inputPath);
                    return resolve();
                })
                .on('error', (err) => {
                    fs.removeSync(inputPath);
                    console.error('error while transcoding: ' + err.message);
                    reject(new InternalServerErrorException('Transcoding failed'));
                })
                .save(outputPath);
        });
    }
}