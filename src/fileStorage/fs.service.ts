import * as fs from 'fs-extra';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IFileStorage } from './fileStorage.interface';
import { NotFoundException } from 'src/common/custom-errors';

@Injectable()
export class FsFileService implements IFileStorage {
    constructor(private readonly configService: ConfigService,
        private readonly videoFileDirPath = this.configService.get<string>('fileStorage.videoDirPath')
    ) { }

    saveFile = async (sourceFilePath: string): Promise<string> => {
        const fileName = sourceFilePath.split('/').pop()!;
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