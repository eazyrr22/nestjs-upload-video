import * as fs from 'fs-extra';
import { basename } from 'path';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { DeleteObjectCommand, PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";

import { IFileStorage, S3_CLIENT_TOKEN } from "./fileStorage.interface";
import { baseExeptions, validationException } from 'src/common/custom-errors';

@Injectable()
export class S3FileService implements IFileStorage {
    constructor(
        @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
        private readonly configService: ConfigService,
        private readonly bucketName = this.configService.get<string>('s3.bucketName')!,
        private readonly maxFileSize = this.configService.get<number>('videoSetting.maxSize')!
    ) { }

    saveFile = async (sourceFilePath: string): Promise<string> => {
        const fileStat = await fs.stat(sourceFilePath);
        if (fileStat.size > this.maxFileSize) {
            throw new validationException('file is too large', 'FILE_LIMIT');
        }
        try {
            const fileName = basename(sourceFilePath);
            const streamFile = fs.createReadStream(sourceFilePath);
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: streamFile,
                ContentType: 'video/mp4'
            });
            await this.s3Client.send(command);

            return 'File uploaded successfully';
        } catch (error) {
            throw new baseExeptions(error.message, error.$metadata.httpStatusCode ?? 500, 'UPLOAD_FAILURE');
        }
    }

    deleteFile = async (fileName: string): Promise<void> => {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileName
            });
            await this.s3Client.send(command);

        } catch (error) {
            throw new baseExeptions(error.message, error.$metadata.httpStatusCode ?? 500, 'UPLOAD_FAILURE');
        }
    }
}