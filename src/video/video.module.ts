import { diskStorage } from 'multer';
import { Module } from "@nestjs/common";
import { v4  } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const newFilename = file.originalname + '-' + v4();
                    cb(null, newFilename);
                }
            })
        })
    ],
    controllers: [],
    providers: [VideoService],
})
export class VideoModule {}

 
