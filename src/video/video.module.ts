import { v4 } from 'uuid';
import { diskStorage } from 'multer';
import { Module } from "@nestjs/common";
import { ensureDirSync } from 'fs-extra';
import { MulterModule } from '@nestjs/platform-express';

import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TranscodeModule } from 'src/ffmpeg/transcode.module';

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
    ],
    controllers: [VideoController],
    providers: [VideoService],
})
export class VideoModule { }


