import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { DeleteObjectCommand, PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";

import { IFileStorage, FILE_STORAGE_TOKEN } from "./fileStorage.interface";
import { baseExeptions } from 'src/common/custom-errors';

@Injectable()
export class S3FileService implements IFileStorage {
    constructor(
        @Inject(FILE_STORAGE_TOKEN) private readonly s3Client: S3Client,
        private readonly configService: ConfigService,
        private readonly bucketName = this.configService.get<string>('s3.bucketName')!
    ) { }

    saveFile = async (sourceFilePath: string): Promise<string> => {
        try {
            const fileName = sourceFilePath.split('/').pop()!;
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