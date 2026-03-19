import { dirname } from 'path';
import * as fs from 'fs-extra';
import ffmpeg from 'fluent-ffmpeg';
import type { ConfigType } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { transcodeConfig } from 'src/config/envConfig';
import { baseExeptions } from 'src/common/custom-errors';

@Injectable()
export class TranscoderService {
    private readonly ffmpegPath: string;
    private readonly encoderOptions: { codec: string, bitrate: string };


    constructor(@Inject(transcodeConfig.KEY) private readonly transcodeSettings: any,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {
    this.ffmpegPath = transcodeSettings.ffmpegPath!;
    ffmpeg.setFfmpegPath(this.ffmpegPath);
    this.encoderOptions = {
        codec: this.transcodeSettings.codec!,
        bitrate: this.transcodeSettings.bitrate!,
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
                this.logger.log('start transcoding');
            })
            .on('end', async () => {
                this.logger.log('Transcoding finished');
                await fs.remove(inputPath);
                return resolve();
            })
            .on('error', (err) => {
                fs.removeSync(inputPath);
                this.logger.error('error while transcoding: ' + err.message);
                reject(new baseExeptions(err.message, HttpStatus.CONFLICT, 'FFMPEG_FAILURE'));
            })
            .save(outputPath);
    });
}
}