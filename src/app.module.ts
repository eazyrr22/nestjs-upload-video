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

const storageType = process.env.STORAGE_TYPE || 'fs';

const dynamicImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
    validationSchema: envValidationSchema,
  }), StorageRegister.register(storageType as 'fs' | 'mongo'),
  VideoModule,
  GenreModule,
  PlaylistModule,
];

if (storageType === 'mongo') {
  dynamicImports.push(
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.mongoUri');
        const dbName = configService.get<string>('database.mongoDbName');
        return { uri: `${uri}/${dbName}` };
      },
    })
  );
}

@Module({
  imports: dynamicImports,
  providers: [FsService, MongoService],
})
export class AppModule { }