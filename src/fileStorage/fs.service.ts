import * as fs from 'fs-extra';
import { basename } from 'path';
import type { ConfigType } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { IFileStorage } from './fileStorage.interface';
import { fileUploadConfig, localStorageConfig } from 'src/config/envConfig'
import { NotFoundException, validationException } from 'src/common/custom-errors';

@Injectable()
export class FsFileService implements IFileStorage {
    private readonly videoFileDirPath: string;
    private readonly maxFileSize: number;


    constructor(
        @Inject(fileUploadConfig.KEY) private readonly fileUploadSettings: any,
            @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
                @Inject(localStorageConfig.KEY) private readonly localStoragePathes: any,
    ) {
    this.videoFileDirPath = this.localStoragePathes.videoFilesDirPath!;
    this.maxFileSize = this.fileUploadSettings.maxFileSize!;
}

saveFile = async (sourceFilePath: string): Promise<string> => {
    const fileStat = await fs.stat(sourceFilePath);
    if (fileStat.size > this.maxFileSize) {
        throw new validationException('file is too large', 'FILE_LIMIT');
    }
    const fileName = basename(sourceFilePath);
    const destinationPath = `${this.videoFileDirPath}/${fileName}`;

    await fs.move(sourceFilePath, destinationPath, { overwrite: true });

    this.logger.log(`File saved successfully`);

    return destinationPath;
}

deleteFile = async (fileName: string): Promise<void> => {
    const filePath = `${this.videoFileDirPath}/${fileName}`;
    const fileExists = await fs.pathExists(filePath);

    if (fileExists) {
        await fs.remove(filePath);
        this.logger.log(`File deleted successfully`);
    }
    else {
        throw new NotFoundException(fileName);
    }
}
}