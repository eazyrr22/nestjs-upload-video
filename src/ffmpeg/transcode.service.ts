import { dirname } from 'path';
import * as fs from 'fs-extra';
import ffmpeg from 'fluent-ffmpeg';
import { type ConfigType } from '@nestjs/config';
import { HttpStatus, Injectable } from '@nestjs/common';

import { transcodeConfig } from 'src/config/envConfig';
import { baseExeptions } from 'src/common/custom-errors';

@Injectable()
export class TranscoderService {
    constructor( private readonly ffmpegPath: string,
    private readonly transcodeSettings: ConfigType <typeof transcodeConfig>,
    private readonly encoderOptions: { codec: string, bitrate: string }
) {
        this.ffmpegPath = transcodeSettings.ffmpegPath! ;
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
                    reject(new baseExeptions(err.message,HttpStatus.CONFLICT,'FFMPEG_FAILURE'));
                })
                .save(outputPath);
        });
    }
}