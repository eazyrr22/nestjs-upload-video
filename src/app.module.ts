import { Module } from '@nestjs/common';
import envConfig from './config/envConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { VideoModule } from './video/video.module';
import { GenreModule } from './genre/genre.module';
import { PlaylistModule } from './playlist/playlist.module';
import { envValidationSchema } from './config/env.validation';
import { StorageRegister } from './databases/storageRegister.module';

const storageType = process.env.DATABASE_TYPE || 'fs';

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
})
export class AppModule { }