import { v4 } from 'uuid';
import { diskStorage } from 'multer';
import { Module } from "@nestjs/common";
import { ensureDirSync } from 'fs-extra';
import { MulterModule } from '@nestjs/platform-express';

import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TranscodeModule } from 'src/ffmpeg/transcode.module';
import { FileStorageModule } from 'src/fileStorage/fileStorage.module';

const fileStorageType = process.env.FILE_STORAGE_TYPE || 'fs';
const tempUploadsDir = process.env.TEMP_UPLOADS_DIR || 'temp-uploads';
ensureDirSync(tempUploadsDir);

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: tempUploadsDir,
                filename: (req, file, cb) => {
                    const newFilename = file.originalname + '-' + v4();
                    cb(null, newFilename);
                }
            })
        }),
        TranscodeModule,
        FileStorageModule.register(fileStorageType as 'fs' | 's3')
    ],
    controllers: [VideoController],
    providers: [VideoService],
})
export class VideoModule { }


