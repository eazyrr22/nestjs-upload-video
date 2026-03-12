import { S3Client } from "@aws-sdk/client-s3";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { S3FileService } from "./s3.service";
import { FsFileService } from "./fs.service";
import { FILE_STORAGE_TOKEN,S3_CLIENT_TOKEN } from "./fileStorage.interface";

@Global()
@Module({})
export class FileStorageModule {
    static register(fileStorageType: 'fs' | 's3'): DynamicModule {
        const providers: any[] = [];
        let selectedService;

        if (fileStorageType === 's3') {
            providers.push({
                provide: S3_CLIENT_TOKEN,
                useFactory: () => new S3Client({
                    region: process.env.AWS_REGION!,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                    }
                })
            });
            providers.push(S3FileService);
            selectedService = S3FileService;
        }
        else {
            providers.push(FsFileService);
            selectedService = FsFileService;
        }
        return {
            module: FileStorageModule,
            providers: [
                ...providers, {
                    provide: FILE_STORAGE_TOKEN,
                    useExisting: selectedService
                }],
            exports: [FILE_STORAGE_TOKEN]
        }
    }
}