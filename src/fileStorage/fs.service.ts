import * as fs from 'fs-extra';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IFileStorage } from './fileStorage.interface';

@Injectable()
export class FsFileService implements IFileStorage {
    constructor(private readonly configService: ConfigService,
        private readonly videoStoragePath = this.configService.get<string>('fileStorage.videoDirPath')
    ) { }

    saveFile = async (sourceFilePath: string): Promise<string> => {
        if (!await fs.pathExists(sourceFilePath)) {
            throw new Error('Source file does not exist');
        }

        const fileName = sourceFilePath.split('/').pop()!;
        const destinationPath = `${this.videoStoragePath}/${fileName}`;

        await fs.move(sourceFilePath, destinationPath, { overwrite: true });

        console.log(`File saved successfully`);

        return destinationPath;
    }


}