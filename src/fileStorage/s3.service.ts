import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { IFileStorage, FILE_STORAGE_TOKEN } from "./fileStorage.interface";

@Injectable()
export class S3FileService implements IFileStorage {
    constructor(
        @Inject(FILE_STORAGE_TOKEN) private readonly s3Client: S3Client,
        private readonly configService: ConfigService,
        private readonly bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!
    ) { }

    saveFile = async (sourceFilePath: string): Promise<string> => {
        if (!await fs.pathExists(sourceFilePath)) {
            throw new Error('Source file does not exist');
        }

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
}