import { Module } from '@nestjs/common';
import envConfig from './config/envConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { VideoModule } from './video/video.module';
import { GenreModule } from './genre/genre.module';
import { FsService } from './databases/fsStorage.service';
import { PlaylistModule } from './playlist/playlist.module';
import { envValidationSchema } from './config/env.validation';
import { MongoService } from './databases/mongoStorage.service';
import { StorageRegister } from './databases/storageRegister.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
    validationSchema: envValidationSchema,
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>(`database.mongoUri/${configService.get<string>('database.mongoDbName')}`)!,
    }),
  }), StorageRegister.register('fs'),
    VideoModule, GenreModule, PlaylistModule],
  providers: [FsService, MongoService],
})
export class AppModule { }