import * as fs from 'fs-extra';
import {basename} from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IFileStorage } from './fileStorage.interface';
import { NotFoundException,validationException } from 'src/common/custom-errors';

@Injectable()
export class FsFileService implements IFileStorage {
    constructor(private readonly configService: ConfigService,
        private readonly videoFileDirPath = this.configService.get<string>('fileStorage.videoDirPath')!,
        private readonly maxFileSize = this.configService.get<number>('videoSetting.maxSize')!
    ) { }

    saveFile = async (sourceFilePath: string): Promise<string> => {
        const fileStat = await fs.stat(sourceFilePath);
        if (fileStat.size > this.maxFileSize) {
            throw new validationException('file is too large', 'FILE_LIMIT');
        }
        const fileName = basename(sourceFilePath);
        const destinationPath = `${this.videoFileDirPath}/${fileName}`;

        await fs.move(sourceFilePath, destinationPath, { overwrite: true });

        console.log(`File saved successfully`);

        return destinationPath;
    }

    deleteFile = async (fileName: string): Promise<void> => {
        const filePath = `${this.videoFileDirPath}/${fileName}`;
        const fileExists = await fs.pathExists(filePath);

        if (fileExists) {
            await fs.remove(filePath);
            console.log(`File deleted successfully`);
        }
        else {
            throw new NotFoundException(fileName);
        }
    }
}