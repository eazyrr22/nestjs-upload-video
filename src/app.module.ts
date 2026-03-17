import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { VideoModule } from './video/video.module';
import { GenreModule } from './genre/genre.module';
import { PlaylistModule } from './playlist/playlist.module';
import { envValidationSchema } from './config/env.validation';
import {FileStorageModule} from './fileStorage/fileStorage.module';
import { StorageRegister } from './databases/storageRegister.module';
import {s3Config,baseConfig,databaseConfig,localStorageConfig,transcodeConfig,fileUploadConfig } from './config/envConfig';

const databaseType = process.env.DATABASE_TYPE || 'fs';
const fileStorageType = process.env.FILE_STORAGE_TYPE || 'fs';

const dynamicImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [s3Config,baseConfig,databaseConfig,localStorageConfig,transcodeConfig,fileUploadConfig ],
    validationSchema: envValidationSchema,
  }), StorageRegister.register(databaseType as 'fs' | 'mongo'),
  FileStorageModule.register(fileStorageType as 'fs' | 's3'),
  VideoModule,
  GenreModule,
  PlaylistModule,
];

if (databaseType === 'mongo') {
  dynamicImports.push(
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig],
      useFactory: async (dbSettings: ConfigType<typeof databaseConfig>) => {
        const uri = dbSettings.mongoUri;
        const dbName = dbSettings.mongoDbName;
        return { uri: `${uri}/${dbName}` };
      },
    })
  );
}

@Module({
  imports: dynamicImports,
})
export class AppModule { }