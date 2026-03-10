import { S3Client } from "@aws-sdk/client-s3";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { S3FileService } from "./s3.service";
import { FsFileService } from "./fs.service";
import { FILE_STORAGE_TOKEN } from "./fileStorage.interface";

@Global()
@Module({})
export class FileStorageModule {
    static register(fileStorageType: 'fs' | 's3'): DynamicModule {
        const importDependencies: any[] = [];
        let selectedProvider ;

        if (fileStorageType === 's3') {
            const s3Client = new S3Client({
                region: process.env.AWS_REGION!,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                },
            });
            importDependencies.push({ s3Client });
            selectedProvider = S3FileService;
        }
        else {
            selectedProvider = FsFileService;
        }
        return {
            module: FileStorageModule,
            imports: importDependencies,
            providers: [selectedProvider, {
                provide: FILE_STORAGE_TOKEN,
                useExisting: selectedProvider
            }],
            exports: [FILE_STORAGE_TOKEN]
        }
    }
}