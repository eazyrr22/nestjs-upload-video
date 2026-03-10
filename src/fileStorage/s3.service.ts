import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { IFileStorage, FILE_STORAGE_TOKEN } from "./fileStorage.interface";

@Injectable()
export class S3FileService implements IFileStorage {
    constructor(
        @Inject(FILE_STORAGE_TOKEN) private readonly s3Client: S3Client,
        private readonly configService: ConfigService,
        private readonly bucketName = this.configService.get<string>('s3.bucketName')!
    ) { }

    saveFile = async (sourceFilePath: string): Promise<string> => {
        const fileName = sourceFilePath.split('/').pop()!;
        const streamFile = fs.createReadStream(sourceFilePath);
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: streamFile,
            ContentType: 'video/mp4'
        });

        const response = await this.s3Client.send(command);

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Failed to upload file to S3');
        }
        const message = 'File uploaded successfully';
        return message;
    }

    deleteFile = async (fileName: string): Promise<void> => {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileName
        });

        const response = await this.s3Client.send(command);

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Failed to delete file from S3');
        }
    }
}