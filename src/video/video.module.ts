import { diskStorage } from 'multer';
import { Module } from "@nestjs/common";
import { v4  } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';

import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TranscoderService } from './video.transcode';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: './temp-uploads',
                filename: (req, file, cb) => {
                    const newFilename = file.originalname + '-' + v4();
                    cb(null, newFilename);
                }
            })
        })
    ],
    controllers: [VideoController],
    providers: [VideoService, TranscoderService],
})
export class VideoModule {}

 
